const parseString = require('xml2js-parser').parseString;
const parseStringSync = require('xml2js-parser').parseStringSync;
const fs = require('fs')
const axios = require("axios");
const axiosRetry = require("axios-retry")
var async = require("async")
const mongoose = require("mongoose")
const neatCsv = require('neat-csv');
var allSettled = require('promise.allsettled')
let threshs = require ('./data/nwccThreshs.js')
const Parent = require("./models/wimsDataDate.js")
const nrHistoricalData = require('./data/nrccHistoryFromTxt.json')
var nrnRockyStns = Object.keys(nrHistoricalData) 
const nrnRockyPsas = require('./data/nrPsas.js')
const nrStnObject = require('./data/nrStnObject.js')
require('dotenv').config()
const AWS = require('aws-sdk');

// comeon ampflify upload my pacjage json
// console.log('nrStnObject', nrStnObject)

// var nrnRockyPsas = new Map([[100421, 3], [100708, 3], [100711, 3], [241206, 4], [241211, 4], [241302, 4], [241405, 4], [241507, 4], [241513, 4], [101013, 6], [101028, 6], [101031, 6], [101045, 6], [242905, 6], [242907, 6], [242912, 6], [242914, 6], [242915, 6], [240207, 7], [240224, 7], [241502, 7], [241901, 7], [241904, 7], [241909, 7], [243204, 9], [245405, 9], [245409, 9], [245412, 9], [245416, 9], [245501, 9], [244603, 12], [244705, 12], [244803, 12], [245607, 12], [480101, 12], [240601, 13], [240704, 13], [240705, 13], [240807, 13], [240809, 13], [240902, 13], [240903, 13], [242205, 13], [242303, 13], [242403, 13], [243704, 13], [245106, 14], [245107, 14], [245108, 13], [245109, 14], [241102, 15], [242501, 15], [244002, 15]])
// var nrnRockyPsas = new Map([[100101, 1], [100204, 1],[240110, 2], [240107, 2], [240112, 2],[100708, 3], [100711, 3], [100421, 3],[241513,4], [241211,4], [241507,4], [241405,4], [241206,4], [241519,4], [241302,4],[100902, 5], [101037, 5], [100714, 5], [100901, 5],[101013, 6], [242915, 6], [101028, 6], [101031, 6], [101045, 6], [242914, 6], [242912, 6], [242905, 6], [242907, 6],[241901, 7], [241502, 7], [241909, 7], [240224, 7], [241904, 7], [240207, 7],[241520, 8], [243002, 8],[245412, 9], [245409, 9], [245501, 9], [245416, 9],[240308, 10], [241802, 10], [240307, 10],[241907, 11], [243303, 11], [241910, 11], [242102, 11], [242207, 11], [242208, 11],[480101, 12], [244603, 12], [245607, 12], [244803, 12], [244705, 12],[242205, 13], [240902, 13], [240704, 13], [240903, 13], [240601, 13], [242403, 13], [240809, 13], [242303, 13], [240807, 13], [240705, 13], [243704, 13],[245107, 14], [245106, 14], [245109, 14], [245108, 14],[242501, 15], [241102, 15], [244002, 15],[244102, 16], [244201, 16], [245303, 16],[320401, 17], [320501, 17],[323536, 18], [322901, 18], [390701, 18], [324605, 18]])
// let threshs = require ('./data/nwccThreshs.js')
// const WimsData = require("./models/wimsData.js")
// const Parent = require("./models/wimsDataDate.js")
const calcPercentile = require('./calcPercentile.js')

var makeDates = () =>{
  var getMonthName = (monthNumber) =>{
    var nameObj = {
      0:'JAN',
      1:'FEB',
      2:'MAR',
      3:'APR',
      4:'MAY',
      5:'JUN',
      6:'JUL',
      7:'AUG',
      8:'SEP',
      9:'OCT', 
      10:'NOV',
      11:'DEC'
    }
    return nameObj[monthNumber]
  }
  var d1  = new Date(new Date() - (1 * 86400000))
  // var d1  = new Date(new Date() - (4 * 86400000))
  var d2  = new Date(new Date() - (2 * 86400000))
  // var d2  = new Date(new Date() - (5 * 86400000))
  var d3  = new Date(new Date() - (3 * 86400000))

  dateObj = {
    forecast:d1.getUTCDate() + '-' + getMonthName(d1.getUTCMonth()) + '-' + d1.getUTCFullYear().toString().substring(2),
    date1:d1.getUTCDate() + '-' + getMonthName(d1.getUTCMonth()) + '-' + d1.getUTCFullYear().toString().substring(2),
    date2:d2.getUTCDate() + '-' + getMonthName(d2.getUTCMonth()) + '-' + d2.getUTCFullYear().toString().substring(2),
    date3:d3.getUTCDate() + '-' + getMonthName(d3.getUTCMonth()) + '-' + d3.getUTCFullYear().toString().substring(2)
  }  

  return dateObj
}
var getFuelModel = (sig) => {
  var centerModels = {
   ALL_GB: {
     fModG: '7G',
     fModY: '16Y',
     typeG: 'O,R',
     typeY: 'N',
     user:679
   },
   EACC: {
     fModG: '7G',
     fModY: '16Y',
     typeG: 'O,R',
     typeY: 'N',
     user:'smarien'
   },
   NRNROCKT: {
     fModG: '',
     fModY: '',
     typeG: 'N',
     typeY: 'N',
     user:679
   }
  }
  return centerModels[sig]
}

var getNrnRockyModel = (stn)=>{
  // console.log('in get rnr rocky model')
  // if(stn == 241907){
  //   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  // }
  var psaNum = nrnRockyPsas.get(stn)
  if(psaNum>=1 && psaNum <=12){ //these are the ones that do other dates for, just fire season can't remember which months
    return 'Y'
  }
  else if(psaNum>=13 && psaNum <=18){
    return 'V'
  }
  else{
    return 'Y'
    // console.log('cant get fuel model from getn station:', stn)
  }
}

var requestAndProcessWimsData = async (sig, model)=>{
  try{
    var datesObject = makeDates()
    const gaccInfo = getFuelModel(sig)
    console.log('model', model, `fMod${model}`, 'sig', sig)
    var fuelModelReq = gaccInfo?.[`fMod${model}`]
    console.log('hyere 1')
    console.log('fuelModelReq ln106', fuelModelReq)
    console.log('hyere 2')
    var obType = gaccInfo?.[`type${model}`]
    const user = gaccInfo.user ? gaccInfo.user : 679
    console.log('user line 109', user)
    // console.log(datesObject, 'sig', sig)   
    // var timeArray = ['forecast', 'date1', 'date2', 'date3'] 
    var timeArray = Object.keys(datesObject)  
    const makeWimsRequest = async () => {
      return allSettled(timeArray.map(requestDate => {
        axiosRetry(axios, { retries: 3 });
        console.log('requesting data', requestDate)
        if(requestDate == 'forecast'){
          console.log('request url', 'https://famprod.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=' + sig + '&type=F&start='+ datesObject[requestDate] + '&end=' + datesObject[requestDate] + '&time=&user=' + user + '&fmodel=' + fuelModelReq)
          return axios.get('https://famprod.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=' + sig + '&type=F&start='+ datesObject[requestDate] + '&end=' + datesObject[requestDate] + '&time=&user=' + user + '&fmodel=' + fuelModelReq)
        }
        else{
          console.log('request url', 'https://famprod.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=' + sig + '&type=' + obType + '&start='+ datesObject[requestDate] + '&end=' + datesObject[requestDate] + '&time=&user=' + user + '&fmodel=' + fuelModelReq)
          return axios.get('https://famprod.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=' + sig + '&type=' + obType + '&start='+ datesObject[requestDate] + '&end=' + datesObject[requestDate] + '&time=&user=' + user + '&fmodel=' + fuelModelReq)
        }
      }))  
    } 
    const wimsRequests = await makeWimsRequest()
    console.log('requested')
    if(sig == 'NRNROCKT'){
      console.log('requesting NR Rockies, ')
    }
    const processData = async () => {
      console.log('processing data')
      return allSettled(wimsRequests.map(requestedData => {
        if(requestedData.status == 'fulfilled'){
           if(sig == 'NRNROCKT'){
            console.log('requestedData NR Rockies, ')
          }
          console.log('requested data fulfilled')
          return processWimsData(requestedData.value.data)
        }
        else{
          console.log('requested data error',requestedData)
          return null
        }
      }))
    }

    const processedData = await processData()
    return processedData
  }
  catch(err){
    console.log('request wims data error', err)
  }
}

var wimsData = async(model) =>{
  var wimsSigs = ['ALL_GB', 'NRNROCKT']
  var gbWimsData = await requestAndProcessWimsData('ALL_GB', model)
  var eaWimsData = await requestAndProcessWimsData('EACC', model)
  console.log('eaWimsData', eaWimsData)
  var nrWimsData = await requestAndProcessWimsData('NRNROCKT', model)
  return{nrWimsData, gbWimsData, eaWimsData}
  // console.log('gbWimsData', nrWimsData[0].status, nrWimsData[1], nrWimsData[2].status, nrWimsData[3].status)
}

async function getNwccData(model){
  console.log('getting nwcc data')
  try{
    // console.log('here')
    var dat = await axios.get('https://famprod.nwcg.gov/batchout/nwccdidx.txt')
    var aw = await neatCsv(dat.data)
    var nwccDat = {}
    var nwccStnArray = []
    for(var ob in aw){
          var stn = aw[ob]['station_id']
          var fuelModel = aw[ob]['fuel_model']
          var erc = aw[ob]['energy_release_component']
          var re = model == 'G' ? /7G/ : /16Y/
          // console.log(threshs[stn])
          // console.log('ob', ob, aw[ob])
          if(fuelModel.search(re) >= 0 ){
            // console.log(stn)
            if(threshs[stn]){
              nwccStnArray.push(stn)
              var threshInfo = getThresh(erc, threshs[stn])
              // console.log('thiresinfo', threshInfo)
              // console.log(getThresh(erc, threshs[stn]))
              nwccDat[stn] = {}
              nwccDat[stn]['erc'] = erc
              nwccDat[stn]['name'] = aw[ob]['station_name']
              nwccDat[stn]['obDate'] = aw[ob]['nfdr_date']
              nwccDat[stn]['lat'] = threshs[stn]['lat']
              nwccDat[stn]['lon'] = threshs[stn]['lon']
              nwccDat[stn]['category'] = threshInfo.currThresh
              nwccDat[stn]['threshLevs'] = threshInfo.threshLevs
            }
          }
        }
        // console.log(new Set(nwccStnArray))
    // console.log(nwccDat)
    console.log('done with nwcc data')
    return nwccDat
  }
  catch(err){
    console.log('getNwccData error', err)
  }

  
}

function getThresh(currErc, currThreshs){
  var threshAr = [currThreshs.max, currThreshs.p97, currThreshs.p90, currThreshs.p80, currThreshs.p70, currThreshs.p50]
  var threshLevAr = ['max', 'p97', 'p90', 'p80', 'p70', 'p50']
  var thresholdvalar = []
  threshAr.map((currThresh, i) =>{
    if(currErc>=currThresh ){
      thresholdvalar.push(threshLevAr[i])
      return threshLevAr[i]
    }
    else if(currErc<currThresh && threshLevAr[i] == 'p50'){
      thresholdvalar.push(threshLevAr[i])
    }
  })
  return {
    currThresh: thresholdvalar[0],
    threshLevs:{
      max:currThreshs.max,
      p97:currThreshs.p97,
      p90:currThreshs.p90,
      p80:currThreshs.p80,
      p70:currThreshs.p70,
      p50: currThreshs.p50
    }
  }
}




// ( //uncomment this to run function automatically
  async function getAllData(){
  try{
    var dataArrayNames = ["forecast", "day1", "day2", "day3"]
    console.log('wimsDatG')
    var wimsDat = await wimsData('G')
    console.log('wimsDatY')
    var wimsDatY = await wimsData('Y')
    var nwccDat = await getNwccData('G')
    var nwccDatY = await getNwccData('Y')

    var forecastObj = {}
    var day1Obj = nwccDat
    var day2Obj = {}
    var day3Obj = {}

    var forecastObjY = {}
    var day1ObjY = nwccDatY
    var day2ObjY = {}
    var day3ObjY = {}
    // console.log(typeof getAllCentersData)

    var gbData = wimsDat.gbWimsData
    var nrData = wimsDat.nrWimsData
    var eaData = wimsDat.eaWimsData

    var gbDataY = wimsDatY.gbWimsData
    var nrDataY = wimsDatY.nrWimsData
    var eaDataY = wimsDatY.eaWimsData

    // console.log('nrData', nrData)
    for(var currArea in wimsDat){
      wimsDat[currArea].map((curr, i)=>{
        if(i == 0){
          forecastObj = {...forecastObj, ...curr.value}
        }
        if(i == 1){
          day1Obj = {...day1Obj, ...curr.value}
        }
        if(i == 2){
          day2Obj = {...day2Obj, ...curr.value}
        }
        if(i == 3){
          day3Obj = {...day3Obj, ...curr.value}
        }
      })
    }

    for(var currArea in wimsDatY){
      wimsDatY[currArea].map((curr, i)=>{
        if(i == 0){
          forecastObjY = {...forecastObjY, ...curr.value}
        }
        if(i == 1){
          day1ObjY = {...day1ObjY, ...curr.value}
        }
        if(i == 2){
          day2ObjY = {...day2ObjY, ...curr.value}
        }
        if(i == 3){
          day3ObjY = {...day3ObjY, ...curr.value}
        }
      })
    }

    var forecast = JSON.stringify(forecastObj)
    var day1 = JSON.stringify(day1Obj)
    var day2 = JSON.stringify(day2Obj)
    var day3 = JSON.stringify(day3Obj)
    // for(var a in nwccDat){
    //   console.log('a', a, nwccDat[a])
    // }
    var day1Ar = Object.keys(day1Obj)
    var saveDate = day1Obj[day1Ar[0]].obDate

    var forecastY = JSON.stringify(forecastObjY)
    var day1Y = JSON.stringify(day1ObjY)
    var day2Y = JSON.stringify(day2ObjY)
    var day3Y = JSON.stringify(day3ObjY)
    // for(var a in nwccDat){
    //   console.log('a', a, nwccDat[a])
    // }
    var day1ArY = Object.keys(day1ObjY)
    var saveDateY = day1ObjY[day1ArY[0]].obDate

    AWS.config.update({ region: 'us-east-2' });

    // Create S3 service object
    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY
    });
    var saveThem = await saveFiles({forecast, day1, day2, day3}, s3, saveDate, 'G')
    var saveThemY = await saveFiles({forecastY, day1Y, day2Y, day3Y}, s3, saveDateY, 'Y')

    if(saveThem.error || saveThem.error){
      return{ error: {gFiles: saveThem.error, yFiles: saveThemY.error}}
    }
    else{
      return {success: saveThem, saveThemY}
    }

    // var forecast = {...wimsDat.gbWimsData[0].value, ...wimsDat.nrWimsData[1].value, ...nrData[0].value}
    // console.log('forecast', forecast)
  }
  catch(err){
    console.log('getAllDataError', err)
    return {error: err}
  }  

  
}
// )()
 //uncomment this line to make the function run automatically
async function saveFiles(dataObject, s3, model){
  try{

    var datesObject = makeDates()
    var saveDate = datesObject.date1
    var fileLocationAr = ['data', 'archive']
    var dataArrayNames = ["forecast", "day1", "day2", "day3", "historic"]
    // console.log('dataObject', dataObject)
    const daysAr = Object.keys(dataObject)
    // console.log('daysAr', daysAr)
    for await (var currDay of daysAr){
      var data = dataObject[currDay]
      var position = dataArrayNames.indexOf(currDay)
      // console.log('currDay', currDay, data)
      const key = model == 'G' ? `${currDay}.json` : `${currDay}${model}.json`
      const uploadParams = { Bucket: 'erc-server-data', Key: `${currDay}.json`, Body: data, ACL: 'public-read' }
      const uploaded = await s3.upload(uploadParams).promise()
      // async.each(fileLocationAr, (file,callback) => {
      //   if(file == 'archive'){
      //     var fileName = saveDate
      //     var filePath = `./data/archive/${fileName}.json`
      //   }
      //   else{
      //     var fileName = currDay
      //     var filePath = `./data/${fileName}.json`
      //   }
      //   console.log('uploaded', uploaded)
      //   fs.writeFile(filePath, data, (err) => {
      //     if (err) return console.log(err)
      //     console.log('saved', fileName)  
      //   })
      // }, function(err){
      //   if(err){
      //     console.log('a file failed to process', fileName)
      //   }
      //   else {
      //     console.log('saved', fileName)
      //   }
      // })
      // if (currDay == 'forecast'){
      //   console.log('data saved to mongo')
      //   var isoDate = new Date(saveDate).toISOString()
      //   mongoose.connect('mongodb://nanhosen:pray4sno@ds151486.mlab.com:51486/wims_archive', {useNewUrlParser: true, useFindAndModify: false}, err => {  
      //     if (err) throw err
      //       Parent.findOneAndUpdate({ 'date': isoDate }, {date: saveDate, data: data}, {upsert: true}, function (err, docs) {
      //         if (err) console.log(err);
      //         console.log('updatedMongo', typeof data)
      //       }).then((asdf) => {
      //       console.log('mongo thjjing ASDF', asdf);
      //       mongoose.connection.close();
      //     },(e) => {
      //       console.log('unable to save');
      //     }); 
      //   })
      // }
      // return
    }
    // return
    return{success: true}
  }
  catch(e){
    return {error: e}
  }
}
// const newTodo = new Todo({text:'cook dinner'});

// newTodo.save().then((docs) => {
//   console.log('todo saved',docs);
//   mongoose.connection.close();
// },(e) => {
//   console.log('unable to save');
// });
async function processWimsData(input){ 
  console.log('in processWimsData')
  // console.log(input, 'input')
  // var nrStns = [ 'r100101','r100204','r100708','r100421','r100711','r100714','r100901','r100902','r101037','r240107','r240112','r101013','r101028','r101031','r101045','r240207','r240224','r240601','r240704','r240705','r240807','r240809','r240902','r241102','r241206','r240903','r241211','r241302','r241405','r241502','r241507','r241519','r241901','r241904','r241909','r242205','r242303','r242403','r242501','r242905','r242907','r242912','r242914','r242915','r243204','r244002','r243704','r244603','r244705','r244803','r245106','r245107','r245108','r245109','r245405','r245409','r245412','r245416','r245501','r245607','r480101']
  // console.log('length', nrStns.length, nrnRockyStns)
  // nrStns.map(currStn => {
  //   var i1 = nrnRockyStns.indexOf(currStn)
  //   if(i1<0){
  //     console.log('currStn1', currStn)
  //   }
  // })
  // nrnRockyStns.map(curstn =>{
  //   if(nrStns.indexOf(curstn) <0){
  //     console.log('curstn2', curstn)
  //   }
  // })
  var historicalData = {}
  var nUtStns = [420403,420703,420705,420706,420901,420911,420912,420914,420915,421101,421103]
  const ercObj = {};
  var stringParse = await parseStringSync(input)
  const sringJson = JSON.stringify(stringParse)
  // console.log('objs', Object.keys(sringJson))
  var resultAr = [];
  if(!stringParse.nfdrs){
    console.log('no string parse', input)
    return null
  }
  else{
    var keyAr = Object.keys(stringParse.nfdrs.row);
    console.log('nfdrs is here gonig to process')
    // console.log('keyAr keyAr',  stringParse.nfdrs.row)
    stringParse.nfdrs.row.map(currStn=>{
      // console.log('currStn', currStn)
      // var  {  sta_id: [ stnId ] } = currStn
      // var stnId = currStn.sta_id[0] 
      // var  {  sta_nm: [ name ] } = currStn
      // console.log('stnId', stnId )
      // var { sta_id,  sta_nm,  nfdr_dt,nfdr_type,msgc,  one_hr,  ten_hr,  hu_hr,  th_hr,  sc,  ec,  bi,  adj} = currStn
      // var  {
      //   sta_id: [ stnId ],
      //   latitude: [ lat ],
      //   longitude: [ lon ],
      //   sta_nm: [ name ],
      //   nfdr_dt: [ obDate ],
      //   nfdr_tm: [ time],
      //   nfdr_type: [ type ],
      //   msgc: [ fuelModel ],
      //   one_hr: [ oneHr],
      //   ten_hr: [ tenHr ],
      //   hu_hr: [ hunHr],
      //   th_hr: [ thouHr],
      //   sc: [ sc],
      //   ec: [ erc],
      //   bi: [ bi ],
      //   adj: [ adj ]
      // } = currStn
      var {
        sta_id: [ stnId ],
        sta_nm: [ name ],
        latitude: [ lat ],
        longitude: [ lon ],
        nfdr_dt: [ obDate ],
        nfdr_tm: [ time ],
        nfdr_type: [ type ],
        msgc: [ fuelModel ],
        one_hr: [ oneHr ],
        ten_hr: [ tenHr ],
        hu_hr: [ hunHr ],
        th_hr: [ thouHr ],
        sc: [ sc ],
        ec: [ erc ],
        bi: [ bi ]
      } = currStn

      
      // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
      // console.log('stn name', name, typeof stnId, parseFloat(stnId))
      var nrStnInfo = nrStnObject[parseFloat(stnId)]
      // if(parseFloat(stnId) == 420913){
      //     console.log('hiiiiiiiiiiiiis iiiiiiiiiiiiiii hiiii', calcPercentile({stnId, erc, bi, obDate}))
      //   }
      // var nrStnInfo =undefined
      // console.log('nrStnInfo id', nrStnInfo)
      var id = stnId
      // if(stnId == '240307'){
      //   console.log('oh hi!!!!!!!!!!!!!!!!', nrStnInfo)
      // }
      // console.log('stnId', fuelModel, stnId, nrStnObject.get(parseFloat(stnId)))
      if(nrStnInfo){
        // console.log('im nr stn info')
        var regex = new RegExp(nrStnInfo.fuelModel, "g")
        // fuelModel.search(regex)
        var isFuelModel = fuelModel.search(regex) >= 0 ? true : false
        // console.log('search', fuelModel.search(regex), fuelModel, nrStnInfo.fuelModel, isFuelModel)

      //   var searchModel = getNrnRockyModel(parseInt(id))
        var percentiles = isFuelModel ? calcPercentile({stnId, erc, bi, obDate}) : undefined
        // console.log('percentiles', percentiles, stnId, erc, bi, obDate) 
        if(isFuelModel){
          var { ercPerc: calculatedErcPercentile, threshs: calculatedThresholds, erc: ercPercentile, bi: biPercentile, jolInd, swfpiFcst, fcstBiPerc:biPerc1, fcstErcPerc: ercPerc1, fcstIndexPerc, fireSeasonPercs, weeklyPercs, currFireSeasonErcPercentile, fuelModel} = percentiles
          ercObj[id]={name,obDate,lat,lon,erc,oneHr,tenHr,hunHr,thouHr,sc,bi,ercPerc1,biPercentile,jolInd,swfpiFcst,fcstIndexPerc,biPerc1,ercPerc1,fcstIndexPerc,fireSeasonPercs,weeklyPercs,currFireSeasonErcPercentile, calculatedErcPercentile, calculatedThresholds, fuelModel}
      
        }
        
      }
      else if(!nrStnInfo){ //not nrStnInfo
        // console.log('in else', id)
        if(id == '420913'){
          // console.log('hiiiiiiiiiiiiis iiiiiiiiiiiiiii hiiii')
          var testPerc = calcPercentile({stnId, erc, bi, obDate})
          // console.log('percentiles', testPerc)
        }
        var percentiles = calcPercentile({stnId, erc, bi, obDate})
        var { ercPerc: calculatedErcPercentile, threshs: calculatedThresholds, erc: ercPercentile, bi: biPercentile, jolInd, swfpiFcst, fcstBiPerc:biPerc1, fcstErcPerc: ercPerc1, fcstIndexPerc, fireSeasonPercs, weeklyPercs, currFireSeasonErcPercentile} = percentiles
        ercObj[id]={name,obDate,lat,lon,erc,oneHr,tenHr,hunHr,thouHr,sc,bi,ercPerc1,biPercentile,jolInd,swfpiFcst,fcstIndexPerc,biPerc1,ercPerc1,fcstIndexPerc,fireSeasonPercs,weeklyPercs,currFireSeasonErcPercentile, calculatedErcPercentile, calculatedThresholds}
      }


    })
  //   var keyMap = keyAr.map((curr)=>{
  //     var entry = stringParse.nfdrs.row[curr];

  //     var id = entry.sta_id[0];
  //     var fuelMod = entry.msgc ? entry.msgc[0] : undefined
  //     // if(fuelMod.search(/Y/) >= 0 ){
  //     //   console.log('fuel model y', fuelMod, id, entry)
  //     // }
  //     const isNR = nrnRockyStns.indexOf('r' + id)>=0 ? true : false
  //     var erc = entry.ec ? entry.ec[0] : undefined
  //     var bi = entry.bi ? entry.bi[0] : undefined
  //     var sc = entry.sc ? entry.sc[0] : undefined
  //     var name = entry.sta_nm ? entry.sta_nm[0] : undefined
  //     var lat = entry.latitude ? entry.latitude[0] : undefined
  //     var lon = entry.longitude ? entry.longitude[0] : undefined
  //     var obDate = entry.nfdr_dt ? entry.nfdr_dt[0] : undefined
  //     var oneHr = entry.one_hr ? entry.one_hr[0] : undefined
  //     var tenHr = entry.ten_hr ? entry.ten_hr[0] : undefined
  //     var hunHr = entry.hu_hr ? entry.hu_hr[0] : undefined
  //     var thouHr = entry.th_hr ? entry.th_hr[0] : undefined
  //     var adj = entry.adj ? entry.adj[0] : undefined
  //     var percentiles = calcPercentile({id, erc, bi, obDate, fuelMod, isNR})
  //     var calculatedErcPercentile = percentiles ? percentiles.ercPerc : undefined
  //     var calculatedThresholds = percentiles ? percentiles.threshs : undefined
  //     // console.log('percentiles', percentiles)
  //     var ercPercentile = percentiles ? percentiles.erc : undefined
  //     var biPercentile = percentiles ? percentiles.bi : undefined
  //     var jolInd = percentiles ? percentiles.jolInd : undefined
  //     var swfpiFcst = percentiles ? percentiles.swfpiFcst : undefined
  //     var biPerc1 = percentiles ? percentiles.fcstBiPerc : undefined
  //     var ercPerc1 = percentiles ? percentiles.fcstErcPerc : undefined
  //     var fcstIndexPerc = percentiles ? percentiles.fcstIndexPerc : undefined
  //     var fireSeasonPercs = percentiles ? percentiles.fireSeasonPercs : undefined
  //     var weeklyPercs = percentiles ? percentiles.weeklyPercs : undefined
  //     var currFireSeasonErcPercentile = percentiles ? percentiles.currFireSeasonErcPercentile : undefined
  //     // console.log(id, 'id')
  //     if(nrnRockyStns.indexOf(id)>=0 ){console.log('suddenly the r is bad')}
  //     if(nrnRockyStns.indexOf('r' + id)>=0 ){
  //       // console.log(nrnRockyPsas.get(parseInt(id)), 'nrn rocky psa psa', id)
  //       if(nrnRockyPsas.get(parseInt(id))){
  //         // console.log(getNrnRockyModel(parseInt(id)), 'fuel modesl thing')
  //         var regex = new RegExp(getNrnRockyModel(parseInt(id)), "g")
  //         var searchModel = getNrnRockyModel(parseInt(id))
  //         if(id == 242207){
  //           console.log('r242207 is here', searchModel, fuelMod, fuelMod.search(regex), erc)
   
  //         }
  //         if(fuelMod.search(regex) >= 0){
  //           // console.log('i found it', id)
  //           ercObj[id]={name,obDate,lat,lon,erc,oneHr,tenHr,hunHr,thouHr,sc,bi,adj,ercPerc1,biPercentile,jolInd,swfpiFcst,fcstIndexPerc,biPerc1,ercPerc1,fcstIndexPerc,fireSeasonPercs,weeklyPercs,currFireSeasonErcPercentile, calculatedErcPercentile, calculatedThresholds}
  //         }
  //       }
  //     }
  //     else{
  //       ercObj[id]={name,obDate,lat,lon,erc,oneHr,tenHr,hunHr,thouHr,sc,bi,adj,ercPerc1,biPercentile,jolInd,swfpiFcst,fcstIndexPerc,biPerc1,ercPerc1,fcstIndexPerc,fireSeasonPercs,weeklyPercs,currFireSeasonErcPercentile, calculatedErcPercentile, calculatedThresholds}
  //     }
      
  //     resultAr.push(entry)
  // }) 
  }
  nrnRockyStns.map(currStn => {
    // console.log(historicalData[currStn])
    if(currStn == 241907 ){
      console.log('currStn 241907', currStn)
    }
    if(ercObj[currStn] &&  historicalData[currStn]){
     var stnHistory =  historicalData[currStn]
     if(Object.keys(stnHistory).length > 1){
       ercObj[currStn] = {...ercObj[currStn], stnHistory}
     }
    }
  }) 
  return ercObj
}
// getAllData()
// 
module.exports = getAllData;
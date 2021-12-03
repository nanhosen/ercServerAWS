const thresholds = require('./thresholds.js')
const jStat = require("jstat")
// const StreamArray = require( 'stream-json/streamers/StreamArray');
const fs = require('fs');

// const jsonStream = StreamArray.withParser();

const dugHistoricalData = require('./data/dugwayAll.js')
const nrHistoricalData = require('./data/nrccHistoryFromTxt.json')
const nUtahSummer = require('./data/nUtahSummerJs.js')
const nUtahFullYear = require('./data/nUtahAll')

const idnameMap = new Map([['420913', 'dugwayN'], ['420916', 'dugwayS'], ['420917', 'dugwayW']])
var nrnRockyStns = Object.keys(nrHistoricalData) 
const nrnRockyPsas = require('./data/nrPsas.js')
// const nrnRockyPsaArray = require('./data/nrPsaArray.js')
// const nrnRockyPsas = new Map([[100101, 1], [100204, 1],[240110, 2], [240107, 2], [240112, 2],[100708, 3], [100711, 3], [100421, 3],[241513,4], [241211,4], [241507,4], [241405,4], [241206,4], [241519,4], [241302,4],[100902, 5], [101037, 5], [100714, 5], [100901, 5],[101013, 6], [242915, 6], [101028, 6], [101031, 6], [101045, 6], [242914, 6], [242912, 6], [242905, 6], [242907, 6],[241901, 7], [241502, 7], [241909, 7], [240224, 7], [241904, 7], [240207, 7],[241520, 8], [243002, 8],[245412, 9], [245409, 9], [245501, 9], [245416, 9],[240308, 10], [241802, 10], [240307, 10],[241907, 11], [243303, 11], [241910, 11], [242102, 11], [242207, 11], [242208, 11],[480101, 12], [244603, 12], [245607, 12], [244803, 12], [244705, 12],[242205, 13], [240902, 13], [240704, 13], [240903, 13], [240601, 13], [242403, 13], [240809, 13], [242303, 13], [240807, 13], [240705, 13], [243704, 13],[245107, 14], [245106, 14], [245109, 14], [245108, 14],[242501, 15], [241102, 15], [244002, 15],[244102, 16], [244201, 16], [245303, 16],[320401, 17], [320501, 17],[323536, 18], [322901, 18], [390701, 18], [324605, 18]])

// var getStns = require('./data/getAllNRCCStns.js') 
// var nrnRockyStns1 = getStns() 
// nrnRockyStns.map(currStn => console.log(nrnRockyStns1.indexOf(currStn)))
// console.log('nrnRockyStns', nrnRockyStns)
// var nrnRockObj = JSON.parse(nrHistoricalData)


var returnCategory = threshs => {
	if(threshs.erc == 'max' || threshs.erc == 'p97'){
		if(threshs.bi == 'max' || threshs.bi == '97'){
			return 5
		}
		else if(threshs.bi == 'p90'){
			return 4
		}
		else if(threshs.bi == 'p80'){
			return 3
		}
		else if(threshs.bi == 'p70'){
			return 2
		}
		else if(threshs.bi == 'p60' || threshs.bi == 'min'){
			return 1
		}
	}
	else if(threshs.erc == 'p90'){
		if(threshs.bi == 'max' || threshs.bi == 'p97' || threshs.bi == 'p90'){
			return 4
		}
		else if(threshs.bi == 'p80'){
			return 3
		}
		else if(threshs.bi == 'p70'){
			return 2
		}
		else if(threshs.bi == 'p60' || threshs.bi == 'min'){
			return 1
		}
	}
	else if(threshs.erc == 'p80'){
		if(threshs.bi == 'max' || threshs.bi == 'p97' || threshs.bi == 'p90' || threshs.bi == 'p80'){
			return 3
		}
		else if(threshs.bi == 'p70'){
			return 2
		}
		else if(threshs.bi == 'p60' || threshs.bi == 'min'){
			return 1
		}
	}
	else if(threshs.erc == 'p70'){
		// console.log('in80', threshs.bi)
		if(threshs.bi == 'max' || threshs.bi == 'p97' || threshs.bi == 'p90' || threshs.bi == 'p80' || threshs.bi == 'p70'){
			return 2
		}
		else if(threshs.bi == 'p60' || threshs.bi == 'min'){
			return 1
		}
	}
	else if(threshs.erc == 'p60' || threshs.erc == 'min'){
		return 1
	}

	
}

var returnRange = (observed, thresholds) => {
	var obsErc = parseInt(observed.erc)
	var obsBi = parseInt(observed.bi)
	var ercThresh = thresholds.erc
	var biThresh = thresholds.bi
	var curRange = {}
	if(obsErc > ercThresh.highest){
		curRange['erc'] = 'max'
	}
	else if( obsErc >= ercThresh.p97 && obsErc < ercThresh.highest){
		curRange['erc'] = 'p97'
	}
	else if (obsErc >= ercThresh.p90 && obsErc < ercThresh.p97){
		curRange['erc'] = 'p90'
	}
	else if (obsErc >= ercThresh.p80 && obsErc < ercThresh.p90){
		curRange['erc'] = 'p80'
	}
	else if (obsErc >= ercThresh.p70 && obsErc < ercThresh.p90){
		curRange['erc'] = 'p70'
	}
	else if (obsErc >= ercThresh.p60 && obsErc < ercThresh.p70){
		curRange['erc'] = 'p60'
	}
	else if(obsErc<ercThresh.p60){
		curRange['erc'] = 'min'
	}


	if(obsBi > biThresh.highest){
		curRange['bi'] = 'max'
	}
	else if( obsBi >= biThresh.p97 && obsBi < biThresh.highest){
		curRange['bi'] = 'p97'
	}
	else if (obsBi >= biThresh.p90 && obsBi < biThresh.p97){
		curRange['bi'] = 'p90'
	}
	else if (obsBi >= biThresh.p80 && obsBi < biThresh.p90){
		curRange['bi'] = 'p80'
	}
	else if (obsBi >= biThresh.p70 && obsBi < biThresh.p90){
		curRange['bi'] = 'p70'
	}
	else if (obsBi >= biThresh.p60 && obsBi < biThresh.p70){
		curRange['bi'] = 'p60'
	}
	else if(obsBi<biThresh.p60){
		curRange['bi'] = 'min'
	}
	var percPercVal = returnCategory(curRange)
	var returnObj = { ...curRange, jolInd: percPercVal}
	return returnObj
}
var calcPercentile = data => {
	// console.log('in calc percentile', data)
	var a = undefined
	var nrn = undefined
	// console.log('hiiii')
	// console.log('data', data)
	var newReturn = {}
	// console.log(data.stnId, 'input id', nrnRockyStns.indexOf(data.stnId))
	var withr = 'r' + data.stnId

	// console.log('withr', withr, nrnRockyStns[withr])
	if(nrnRockyStns.indexOf(withr) >=0){
		// console.log('nrnrocky')
		// console.log('asdf', nrnRockyPsas.get(parseFloat(data.stnId)), typeof data.stnId)
		nrn = nrThreshs(data)
		newReturn = nrn
	}
	// console.log('idnameMap.get', idnameMap.get(data.stnId), data.stnId)
	if(idnameMap.get(data.stnId)){
			// console.log('make threhs')
			a = makeThreshs(data)
	}
	if(thresholds[data.stnId]){
		var stnThreshold = thresholds[data.stnId]
		var returnRangeVar = returnRange(data, stnThreshold)
		newReturn = {...returnRangeVar, ...a}
	}
	var nUtStns = [420403,420703,420705,420706,420901,420911,420912,420914,420915,421101,421103]
	if(nUtStns.indexOf(parseInt(data.stnId))>=0){
		var nUtahRangeVar = nUtahCalcs(data.stnId, data.erc, data.obDate)
		newReturn = {...nUtahRangeVar, ...a}
  }
  // console.log('new return', newReturn)
  return newReturn
	
}

function nUtahCalcs(stnId, ercOb, today){
	var stns = Object.keys(nUtahSummer)
	var obDate = new Date(today)
	var obWeekNum = getNumberOfWeek(obDate)
	// console.log('today', today, obDate, 'obdate', obWeekNum)
	var stnThreshs = {}
	var currStn = `nu${stnId}`
	var currStnDataFireSeason = nUtahSummer[currStn]
	var currStnDataFullYear = nUtahFullYear[currStn]

	stnThreshs[currStn] = {
		erc:ercOb,
		fireSeasonPercs: {},
		weeklyPercs: {}
	}
	var ercArray = []
	currStnDataFireSeason.map(currStnDataFireSeasonDay => {
		ercArray.push(currStnDataFireSeasonDay[1])
	})
	stnThreshs[currStn]['fireSeasonPercs']['p100'] = jStat.percentile(ercArray, 1)
	stnThreshs[currStn]['fireSeasonPercs']['p90'] = jStat.percentile(ercArray, 0.9)
	stnThreshs[currStn]['fireSeasonPercs']['p80'] = jStat.percentile(ercArray, 0.8)
	stnThreshs[currStn]['fireSeasonPercs']['p70'] = jStat.percentile(ercArray, 0.7)
	stnThreshs[currStn]['fireSeasonPercs']['p60'] = jStat.percentile(ercArray, 0.6)
	stnThreshs[currStn]['fireSeasonPercs']['p50'] = jStat.percentile(ercArray, 0.5)
	stnThreshs[currStn]['currFireSeasonErcPercentile'] = jStat.percentileOfScore(ercArray, ercOb) * 100

	var counter = 0
	var allWeekNums = []
	var weekArray = new Array(54).fill([])	
	currStnDataFullYear.map((currStnDataFullYearDay,i) => {
		var ercArrayWeek = getNumberOfWeek(currStnDataFullYearDay[0])
		var oldAr = weekArray[ercArrayWeek]
		var newAr = [... oldAr]
		newAr.push(currStnDataFullYearDay[1])
		// console.log('newar', newAr)
		weekArray[ercArrayWeek] = newAr
	})
	var weekName = `week${obWeekNum}`
	// console.log('weekarray1', weekArray)
	// console.log('weekarray', obWeekNum, weekArray[obWeekNum])
	
	stnThreshs[currStn]['weeklyPercs']['p100'] = jStat.percentile(weekArray[obWeekNum], 1)
	stnThreshs[currStn]['weeklyPercs']['p90'] = jStat.percentile(weekArray[obWeekNum], 0.9)
	stnThreshs[currStn]['weeklyPercs']['p80'] = jStat.percentile(weekArray[obWeekNum], 0.8)
	stnThreshs[currStn]['weeklyPercs']['p70'] = jStat.percentile(weekArray[obWeekNum], 0.7)
	stnThreshs[currStn]['weeklyPercs']['p60'] = jStat.percentile(weekArray[obWeekNum], 0.6)
	stnThreshs[currStn]['weeklyPercs']['p50'] = jStat.percentile(weekArray[obWeekNum], 0.5)

	stnThreshs[currStn]['weeklyPercs']['weekNumber'] = obWeekNum

	var name = `week${obWeekNum}Percentile`
	stnThreshs[currStn]['weeklyPercs']['weeklyErcPercentile'] = jStat.percentileOfScore(weekArray[obWeekNum], ercOb) * 100


	stnData = {stnThreshs}
	// console.log('data', stnThreshs[currStn])
	return stnThreshs[currStn]


}

function getNumberOfWeek(curDate) {
    const curDateFormat = new Date(curDate);
    const firstDayOfYear = new Date(curDateFormat.getFullYear(), 0, 1);
    const pastDaysOfYear = (curDateFormat - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getModel(psaNum){
	if(psaNum>=1 && psaNum <=12){ //these are the ones that do other dates for, just fire season can't remember which months
    return 'Y'
  }
  else if(psaNum>=13 && psaNum <=18){
    return 'V'
  }
  else{
    return 'Y'
    console.log('cant get fuel model from getn station:', stn)
  }
}


function nrThreshs(data, psas){
	// var monthsToGrab = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] //js months are off by 1, so 5 is june and 8 is sepetmber

	var psaNum = nrnRockyPsas.get(parseFloat(data.stnId))
	
	const monthObj = {
		short: [ 4, 5, 6, 7, 8, 9], //js months are off by 1, so 5 is june and 8 is sepetmber
		full: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	}
	const isShort = psaNum>=1 && psaNum <=12 ? 'short' : 'full'
	const fuelModel = getModel(psaNum)
	if(withr == 'r240307'){
		console.log('240307 fuel model', fuelModel)
	}
	// console.log(data.stnId, fuelModel, isShort)
	// console.log(data.stnId, isShort, psaNum)
	const useMonths = monthObj[isShort]
	// console.log('useMonths', useMonths)
	// var hm = ug('yu')
	// console.log('hm', hm)
	// console.log('data in to nrthreshts', psaNum)
 //  // const monthsToRequest = getMonths(psaNum)
 //  console.log('psaNum', psaNum)
 //  // console.log('psaNum', psaNum, 'monthsToRequest', monthsToRequest)
	// const requestMonths = {
// https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=EACC&type=O,R&start=12-MAY-21&end=12-MAY-21&time=&user=679&fmodel=7G
// https://fam.nwcg.gov/wims/xsql/nfdrs.xsql?stn=&sig=EACC&type=O&start=2-APR-19&end=2-APR-19&time=&user=smarien&fmodel=7G
	// }
	// console.log('rrary', nrnRockyPsas)
	var obErc = Math.round(data.erc)
	var withr = 'r' + data.stnId
	var stnHistory = nrHistoricalData[withr]
	// console.log(stnHistory)
	var ercArray = []
	stnHistory.map(curr => {
		var currMonth = new Date(curr[0]).getMonth()
		if(withr == 'r244002'){
			// console.log(currMonth, useMonths.indexOf(currMonth), useMonths)
		}
		// console.log(typeof currMonth)
		// console.log('currMonth', currMonth)
		if(useMonths.indexOf(currMonth)>=0){
			ercArray.push(curr[1])
		} 
	})
	// console.log(ercArray, withr)
	var ercPerc = jStat.percentileOfScore(ercArray, obErc, '') * 100
	// console.log('ercPerc', ercPerc, data.stnId)
	var ercPercSmall = jStat.percentileOfScore(ercArray, obErc)
	var p50 = jStat.percentile(ercArray, 0.5)
	var p60 = jStat.percentile(ercArray, 0.6)
	var p70 = jStat.percentile(ercArray, 0.7)
	var p80 = jStat.percentile(ercArray, 0.8)
	var p90 = jStat.percentile(ercArray, 0.9)
	var p100 = jStat.percentile(ercArray, 1)
	if(withr == 'r244002'){
		// console.log('ercArray', ercArray, 'psaNum', psaNum)
		// console.log('r244002 in calc perc currMonth',  'obErc', obErc, 'ercPerc', ercPerc, 'ercPercSmall', ercPercSmall, 'p50:', p50, 'p60:', p60, 'p70', p70, 'p80', p80, 'p90', p90, 'p100', p100)
	}

	// var returnObj = {ercPerc, threshs:p50, p60, p70, p80, p90, p100}
	// console.log('returnObj', {ercPerc, threshs:{p50, p60, p70, p80, p90, p100}})
	return {ercPerc, threshs:{p50, p60, p70, p80, p90, p100}, fuelModel }
}

var makeThreshs = data =>{
	console.log('in make threhs', data)
	if(idnameMap.get(data.stnId)){
		var stnHistory = dugHistoricalData[idnameMap.get(data.stnId)]
		var dateArray = []
		var ercArrayUnSorted = []
		var biArray = []
		var fcstErc = parseInt(data.erc)
		var fcstBi = parseInt(data.bi)
		stnHistory.map(curr =>{
			dateArray.push(curr[0])
			ercArrayUnSorted.push(curr[1])
			biArray.push(curr[2])
		})
		ercArray = ercArrayUnSorted.sort()
		var fcstErcPerc = jStat.percentileOfScore(ercArray, fcstErc) * 100
		var fcstBiPerc = jStat.percentileOfScore(ercArray, fcstBi) * 100
		var multiply = fcstBiPerc * fcstErcPerc
		var ercPercArray = ercArray.map((curr,i)=>{
			return jStat.percentileOfScore(ercArray,curr) * 100	
		})

		var biPercArray = biArray.map((curr,i)=>{
			return jStat.percentileOfScore(biArray,curr)	* 100
		})
		var multArray = ercPercArray.map((curr,i) => {
			return curr * biPercArray[i]
		})
		var multPercArray = multArray.map(curr => {
			return jStat.percentileOfScore(multArray,curr)	* 100
		})



		var fcstErcPerc = jStat.percentileOfScore(ercArray, fcstErc) * 100
		var fcstBiPerc = jStat.percentileOfScore(ercArray, fcstBi) * 100
		var multiply = fcstBiPerc * fcstErcPerc
		var fcstIndexPerc = jStat.percentileOfScore(multArray,multiply)	* 100

		
		var swfpiFcst
		if(fcstIndexPerc>=97){
			swfpiFcst = 5
		}
		else if(fcstIndexPerc >= 90 && fcstIndexPerc < 97){
			swfpiFcst = 4
		}
		else if(fcstIndexPerc >= 80 && fcstIndexPerc < 90){
			swfpiFcst = 3
		}
		else if(fcstIndexPerc >= 60 && fcstIndexPerc < 80){
			swfpiFcst = 2
		}
		else if (fcstIndexPerc < 60){
			swfpiFcst = 1
		}
		else
			swfpiFcst = null
		return {swfpiFcst, fcstBiPerc, fcstErcPerc, fcstIndexPerc}
		// console.log(ercPercArray, biPercArray, multPercArray)
	}
}

module.exports = calcPercentile;

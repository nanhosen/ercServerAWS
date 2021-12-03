const nrccStnJson = require('./ercCSVs/jsons/rawsLocationsNRCC.json')
var stnArray = []
var getStns = () => {
	for (var a in nrccStnJson){
		var second = nrccStnJson[a]
		for(var b in second){
			if(second[b].properties){
				stnArray.push('r' + second[b].properties.id)
			}
		}
	}
	return stnArray
}

module.exports = getStns
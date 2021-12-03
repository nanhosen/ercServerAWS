const nrccStnJson = require('./rawsLocationsNRCC.json')
var stnArray = []
for (var a in nrccStnJson){
	var second = nrccStnJson[a]
	for(var b in second){
		if(second[b].properties){
			stnArray.push(second[b].properties.id)
		}
	}
}
return stnArray
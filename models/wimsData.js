const mongoose = require('mongoose')
const Schema = mongoose.Schema


const wimsDataSchema = new Schema(
	{ 
		obDate: { type: Date }
		{
			id: Number,
			name: { type: String, uppercase: true },
			lat: String,
			lon: String,
			erc: String,
			oneHr: String,
			tenHr: String,
			hunHr: String,
			thouHr: String,
			sc: String,
			bi: String,
			adj: String,
			biPercentile: String,
			ercPerc1: Number,
			jolInd: Number,
			swfpiFcst: Number,
			fcstIndexPerc: Number,
			biPerc1: Number
		}
	}
)

wimsDataSchema.pre('save', function(next) { 
 	const archiveData = this // get access to the archiveData model
 	next()
})

// wimsDataSchema.methods.comparePassword = function(candidatePassword, callback) {

// }

const WimsData = mongoose.model('archiveData', wimsDataSchema)

module.exports = WimsData




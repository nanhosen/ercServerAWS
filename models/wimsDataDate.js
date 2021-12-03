const mongoose = require('mongoose')
const Schema = mongoose.Schema

const zoneinfoSchema = new Schema(
	{ 
		zone: { type: String, uppercase: true }, 
		center_id: { type: String, uppercase: true },
		CWA: String,
		elevation: { type: String, lowercase: true, default: null },
		coords: String,
		rawsObject: {},
		cured: { type: Boolean, default: false },
		ERC_threshold: Number,
		manual: { type: String, default: 'not set' },
		manual_expires: { type: Date, default: null },
		updated: { type: Date, default: Date.now },
	}, 
	{ collection: 'archiveData' },
	{ runSettersOnQuery: true }
)

var dateSchema = new Schema({ date: Date });
var dateSchema = new Schema({ data: Array });
var data1Schema = new Schema({
			date: Date,
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
		})

var parentSchema = new Schema({
  // Array of subdocuments
  date: Date,
  data: Object
  // Single nested subdocuments. Caveat: single nested subdocs only work
  // in mongoose >= 4.2.0
},{ collection: 'archiveData' });
var Parent = mongoose.model('Parent', parentSchema)
// var parent = new Parent({children: [{name: 'Matt'}, {name: 'Sara'}]})
// parent.save(function (err) {
//   console.log(err) // #sadpanda
// });
module.exports = Parent

// const wimsDataSchema = new Schema(
// 	{ 
// 		obDate: { type: Date },
// 		id: Number,
// 		name: { type: String, uppercase: true },
// 		lat: String,
// 		lon: String,
// 		erc: String,
// 		oneHr: String,
// 		tenHr: String,
// 		hunHr: String,
// 		thouHr: String,
// 		sc: String,
// 		bi: String,
// 		adj: String,
// 		biPercentile: String,
// 		ercPerc1: Number,
// 		jolInd: Number,
// 		swfpiFcst: Number,
// 		fcstIndexPerc: Number,
// 		biPerc1: Number,
// 	}, 
// 	{ collection: 'archiveData' },
// 	{ runSettersOnQuery: true }
// )

// wimsDataSchema.pre('save', function(next) { 
//  	const archiveData = this // get access to the archiveData model
//  	next()
// })

// wimsDataSchema.methods.comparePassword = function(candidatePassword, callback) {

// }

// const WimsDataDate = mongoose.model('archiveData', wimsDataSchema)

// module.exports = WimsDataDate




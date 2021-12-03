//original nr stn obj
const nrStnObj = 
{
	100101: {psa: 1, fuelModel: 'Y', months: 'short'}, 
	100204: {psa: 1, fuelModel: 'Y', months: 'short'},
	240110: {psa: 2, fuelModel: 'Y', months: 'short'}, 
	240107: {psa: 2, fuelModel: 'Y', months: 'short'},  
	240307: {psa: 10, fuelModel: 'Y', months: 'short'},
	240112: {psa: 2, fuelModel: 'Y', months: 'short'},
	100708: {psa: 3,fuelModel: 'Y', months: 'short'},
	100711: {psa: 3,fuelModel: 'Y', months: 'short'},
	100421: {psa: 3,fuelModel: 'Y', months: 'short'},
	241513: {psa: 4, fuelModel: 'Y', months: 'short'},
	241211: {psa: 4, fuelModel: 'Y', months: 'short'},
	241507: {psa: 4, fuelModel: 'Y', months: 'short'},
	241405: {psa: 4, fuelModel: 'Y', months: 'short'},
	241206: {psa: 4, fuelModel: 'Y', months: 'short'},
	241519: {psa: 4, fuelModel: 'Y', months: 'short'},
	241302: {psa: 4, fuelModel: 'Y', months: 'short'},
	241802: {psa: 10, fuelModel: 'Y', months: 'short'},
	100902: {psa: 5, fuelModel: 'Y', months: 'short'}, 
	101037: {psa: 5, fuelModel: 'Y', months: 'short'}, 
	100714: {psa: 5, fuelModel: 'Y', months: 'short'}, 
	100901: {psa: 5, fuelModel: 'Y', months: 'short'},
	101013: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	242915: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	101028: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	101031: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	101045: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	240308: {psa: 10, fuelModel: 'Y', months: 'short'},
	242914: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	242912: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	242905: {psa: 6, fuelModel: 'Y', months: 'short'}, 
	242907: {psa: 6, fuelModel: 'Y', months: 'short'},
	241901: {psa: 7, fuelModel: 'Y', months: 'short'}, 
	241502: {psa: 7, fuelModel: 'Y', months: 'short'}, 
	241909: {psa: 7, fuelModel: 'Y', months: 'short'}, 
	240224: {psa: 7, fuelModel: 'Y', months: 'short'}, 
	241904: {psa: 7, fuelModel: 'Y', months: 'short'}, 
	240207: {psa: 7, fuelModel: 'Y', months: 'short'},
	241520: {psa: 8, fuelModel: 'Y', months: 'short'}, 
	243002: {psa: 8, fuelModel: 'Y', months: 'short'},
	245412: {psa: 9, fuelModel: 'Y', months: 'short'}, 
	245409: {psa: 9, fuelModel: 'Y', months: 'short'}, 
	245501: {psa: 9, fuelModel: 'Y', months: 'short'}, 
	245416: {psa: 9, fuelModel: 'Y', months: 'short'},
	240307: {psa: 10, fuelModel: 'Y', months: 'short'},
	40308: {psa: 10, fuelModel: 'Y', months: 'short'}, 
	41802: {psa: 10, fuelModel: 'Y', months: 'short'}, 
	40307: {psa: 10, fuelModel: 'Y', months: 'short'},
	41907: {psa: 11, fuelModel: 'Y', months: 'short'},
	241907: {psa: 11, fuelModel: 'Y', months: 'short'}, 
	43303: {psa: 11, fuelModel: 'Y', months: 'short'}, 
	41910: {psa: 11, fuelModel: 'Y', months: 'short'}, 
	243303: {psa: 11, fuelModel: 'Y', months: 'short'},
	241910: {psa: 11, fuelModel: 'Y', months: 'short'},
	242102: {psa: 11, fuelModel: 'Y', months: 'short'},
	242207: {psa: 11, fuelModel: 'Y', months: 'short'},
	42102: {psa: 11, fuelModel: 'Y', months: 'short'}, 
	42207: {psa: 11, fuelModel: 'Y', months: 'short'}, 
	242208: {psa: 11, fuelModel: 'Y', months: 'short'},
	480101: {psa: 12, fuelModel: 'Y', months: 'short'}, 
	244603: {psa: 12, fuelModel: 'Y', months: 'short'}, 
	245607: {psa: 12, fuelModel: 'Y', months: 'short'}, 
	244803: {psa: 12, fuelModel: 'Y', months: 'short'}, 
	244705: {psa: 12, fuelModel: 'Y', months: 'short'},
	242205: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240902: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240704: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240903: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240601: {psa: 13, fuelModel: 'V', months: 'full'}, 
	242403: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240809: {psa: 13, fuelModel: 'V', months: 'full'}, 
	242303: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240807: {psa: 13, fuelModel: 'V', months: 'full'}, 
	240705: {psa: 13, fuelModel: 'V', months: 'full'}, 
	243704: {psa: 13, fuelModel: 'V', months: 'full'},
	245107: {psa: 14, fuelModel: 'V', months: 'full'}, 
	245106: {psa: 14, fuelModel: 'V', months: 'full'}, 
	245109: {psa: 14, fuelModel: 'V', months: 'full'}, 
	245108: {psa: 14, fuelModel: 'V', months: 'full'},
	242501: {psa: 15, fuelModel: 'V', months: 'full'}, 
	241102: {psa: 15, fuelModel: 'V', months: 'full'}, 
	244002: {psa: 15, fuelModel: 'V', months: 'full'},
	244102: {psa: 16, fuelModel: 'V', months: 'full'}, 
	244201: {psa: 16, fuelModel: 'V', months: 'full'}, 
	245303: {psa: 16, fuelModel: 'V', months: 'full'},
	320401: {psa: 17, fuelModel: 'V', months: 'full'}, 
	320501: {psa: 17, fuelModel: 'V', months: 'full'},
	323536: {psa: 18, fuelModel: 'V', months: 'full'}, 
	322901: {psa: 18, fuelModel: 'V', months: 'full'}, 
	390701: {psa: 18, fuelModel: 'V', months: 'full'}, 
	324605: {psa: 18, fuelModel: 'V', months: 'full'}
}
module.exports = nrStnObj;


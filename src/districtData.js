const districtData = require('./districtData.json');

function getDistrictByAGS(ags) {
	if (!ags) return null;
	return districtData.find(d => d.ags === ags);
}

module.exports = {
	getDistrictByAGS
}
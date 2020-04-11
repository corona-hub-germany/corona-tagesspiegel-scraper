const axios = require('axios').default;
const moment = require('moment');
const Papa = require('papaparse')
const { getDistrictByAGS } = require('./districtData');

const URL_INFECTED =  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTiKkV3Iy-BsShsK3DSUeO9Gpen7VwsXM_haCOc8avj1PeoCIWqL4Os-Uza3jWMEUgmTrEizEV-Itq5/pub?output=csv";
const URL_DEAD =      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTkw2_oVkpZ9-WQk-BRf4Pgam9aRmH62uCUr9FiY0Uxv5ixtDhwSsecc_QMrfrD4ncHsCAua2f0TJh/pub?output=csv";
const URL_RECOVERED = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhIws1DYD51JuJJZbqSycONGWzvelHC6tAfH4RxGDcWHtP0AUYoErTlHXksWgwdddRyZkw8GdEHKZk/pub?output=csv";

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

module.exports = class TagesspiegelCoronaGermanyDataScraper {

	constructor(options) {
		this.options = Object.assign({
			url: 'https://interaktiv.tagesspiegel.de/lab/karte-sars-cov-2-in-deutschland-landkreise/'
		}, options );
	}

	async loadPage() {
		const papaConfig = {
			header: true
		};

		try {
			const [ responseInfected, responseDead, responseRecovered ] = await Promise.all([
				axios.get(URL_INFECTED, {}),
				axios.get(URL_DEAD, {}),
				axios.get(URL_RECOVERED, {})
			]);
			// TODO: handle this.dataInfected.errors

			this.dataInfected = Papa.parse(responseInfected.data, papaConfig).data;
			this.dataDead = Papa.parse(responseDead.data, papaConfig).data;
			this.dataRecovered = Papa.parse(responseRecovered.data,papaConfig).data;

		} catch(err) {
			throw new Error(`Error requesting remote spreadsheet data: ${err}`);
		}
	}

	getSourceUrl() {
		return this.options.url;
	}

	getCopyright() {
		return ['Risklayer', 'CEDIM (KIT)'];
	}

	getLastUpdate() {
		const dateTimes = [];
		for (let data of [ this.dataInfected, this.dataDead, this.dataRecovered ]) {
			for (let entry of data) {
				const dateTime = entry.current_time ? moment(entry.current_time, DATE_TIME_FORMAT) : null;
				if (dateTime && dateTime.isValid()) {
					dateTimes.push(dateTime);
				}
			}
		}
		
		const maxDatTime = moment.max(dateTimes);
		return maxDatTime.toISOString();
	}

	getEntries() {
		var data = [];

		for (const entryInfected of this.dataInfected) {
			const AGS = entryInfected.AGS.padStart(5, '0');
			const district = getDistrictByAGS(AGS);
			if (!district) {
				throw new Error(`Could not find district with AGS "${AGS}"`);
			}
			const entryDead = this.dataDead.find(d => d.AGS === entryInfected.AGS);
			const entryRecovered = this.dataRecovered.find(d => d.AGS === entryInfected.AGS);
			const entryAll = {
				name: district.name,
				ags: AGS,
				infected: entryInfected.current
			};
			if (entryDead && !isNaN(entryDead.current)) {
				entryAll.dead = entryDead.current
			}
			if (entryRecovered && !isNaN(entryRecovered.current)) {
				entryAll.recovered = entryRecovered.current
			}
			data.push(entryAll);
		}
		return data;
	}

}
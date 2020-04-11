'use strict';

const TagesspiegelCoronaGermanyDataScraper = require('./src/TagesspiegelCoronaGermanyDataScraper');
const telegramSendMessage = require('./src/telegramSendMessage');

module.exports.getTagesspiegelData = async (event, context, callback) => {
	try {
		const scraper = new TagesspiegelCoronaGermanyDataScraper({
			useFileCache: false
		});

		await scraper.loadPage();

		const srcUrl = scraper.getSourceUrl();
		const copyright = scraper.getCopyright();
		const lastUpdate = scraper.getLastUpdate();
		const data = scraper.getEntries();

		const returnJson = {
			srcUrl,
			copyright,
			lastUpdate,
			data
		}

		return {
			statusCode: 200,
			body: JSON.stringify(returnJson, null, 2),
		};

	} catch (err) {
		telegramSendMessage(`Error in getTagesspiegelData : ${err}`);
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};

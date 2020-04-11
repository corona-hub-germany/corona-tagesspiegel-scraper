const TagesspiegelCoronaGermanyDataScraper = require('../src/TagesspiegelCoronaGermanyDataScraper');

(async () => {
	const scraper = new TagesspiegelCoronaGermanyDataScraper({
		useFileCache: true
	});

	await scraper.loadPage();

	//console.log(scraper.getLastUpdate());

	const data = scraper.getEntries();
	data.forEach(d => {
		console.log(`${d.name} (${d.ags}): infected:${d.infected}, dead:${d.dead}, recovered:${d.recovered}`);
		return
	});
})()
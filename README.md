# corona-tagesspiegel-scraper
Scrape corona case-data from [interaktiv.tagesspiegel.de](https://interaktiv.tagesspiegel.de/lab/karte-sars-cov-2-in-deutschland-landkreise/) and provides the data as an API.

## Serverless

You can depoy a serverless function:

```sh
serverless deploy
```

You'll need to set a few environment-variables to recieve error messages from the telegram corona-serverless-error-bot:

* TELEGRAM_BOT_TOKEN
* TELEGRAM_CHAT_ID

Here is an example endpoint you can use:

https://tv316pcf2g.execute-api.eu-central-1.amazonaws.com/dev/getTagesspiegelData

## API Example

```js
const TagesspiegelCoronaGermanyDataScraper = require('corona-tagesspiegel-scraper');
	
const scraper = new TagesspiegelCoronaGermanyDataScraper();
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

console.log(returnJson);
```

Output:
```js
{
	"srcUrl": "https://interaktiv.tagesspiegel.de/lab/karte-sars-cov-2-in-deutschland-landkreise/",
	"copyright": [
		"Risklayer",
		"CEDIM (KIT)"
	],
	"lastUpdate": "2020-04-11T18:00:00.000Z",
	"data": [
		{
			"name": "Flensburg, Stadt",
			"ags": "01001",
			"infected": "32",
			"dead": "1",
			"recovered": "16"
		},
		...
	]
}
```
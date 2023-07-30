const fetch = require('node-fetch')
const ProxyAgent = require('https-proxy-agent')
const items = require('./items.json').items
const proxies = require('./proxies.json').proxies
const editJsonFile = require('edit-json-file')
let count = 0;

async function fetchData() {
    let date = new Date() - 2629800000
    while (count < items.length) {
        let item = items[count]
        let proxyRandomizer = proxies[Math.floor(Math.random() * proxies.length)];
        let agent = ProxyAgent('http://' + proxyRandomizer)
        let url = `https://economy.roblox.com/v1/assets/${item}/resale-data`;
        let headers = {
            'Content-Type': 'application/json',
        };
        try {
            const response = await fetch(url, {agent, headers});
            const data = await response.json();
            count++
            if (data?.volumeDataPoints?.length > 1) {
                let thirtyDayVol = 0
                for (const volume of data.volumeDataPoints) {
                    let dateConversion = new Date(`${volume.date}`).getTime()
                    if (dateConversion >= date) {
                        thirtyDayVol = thirtyDayVol + volume.value
                    }
                }
                let file = editJsonFile(`${__dirname}/daily.json`);
                file.set(`${item}`, `${Math.round((thirtyDayVol/30) * 100.00) / 100.00}`);
                file.save();
                file = editJsonFile(`${__dirname}/daily.json`, {
                    autosave: true
                });
                let file1 = editJsonFile(`${__dirname}/month.json`);
                file1.set(`${item}`, `${thirtyDayVol}`);
                file1.save();
                file1 = editJsonFile(`${__dirname}/month.json`, {
                    autosave: true
                });
                console.log(item, "has a 30d value of: ", thirtyDayVol, "and an average daily sell of:", Math.round(((thirtyDayVol/30) * 100.00)) / 100.00)
            } else {
                console.log(item, "does not have enough data")
            }
        } catch(error) {
            console.log(error)
        }
    }
    console.log("Finished!")
}
fetchData()

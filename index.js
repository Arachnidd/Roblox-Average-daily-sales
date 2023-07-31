const fetch = require('node-fetch')
const fs = require('fs')
const ProxyAgent = require('https-proxy-agent')
const items = require('./items.json').items
const proxies = require('./proxies.json').proxies
let count = 0;

// pre-setup
fs.writeFile('./daily.json', '{}', (err) => {if (err) {console.log(err)}})
fs.writeFile('./month.json', '{}', (err) => {if (err) {console.log(err)}})


async function editJSON(filename,key,value){
   const raw = await fs.promises.readFile(filename,'utf-8',(err) => {if (err) {console.log(err)}})
   let data = JSON.parse(raw)
   data[key] = value
   const tosend = JSON.stringify(data)
   await fs.promises.writeFile(filename,tosend,(err) => {if (err) {console.log(err)}})
}

async function fetchData() {
    const date = new Date() - 2629800000
    const headers = {
        'Content-Type': 'application/json',
    };
    // updated operator here
    while (count <= items.length) {
        let item = items[count]
        let proxyRandomizer = proxies.proxies[Math.floor(Math.random() * proxies.proxies.length)];
        let agent = ProxyAgent('http://' + proxyRandomizer)
        let url = `https://economy.roblox.com/v1/assets/${item}/resale-data`;
        try {
            let response
            if (proxies.useproxies) {
              response = await fetch(url, {agent, headers});
            } else {
                response = await fetch(url, {headers});
            }
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
                // daily
                await editJSON('./daily.json',item,Math.round((thirtyDayVol/30) * 100.00) / 100.00)
                //monthly
                await editJSON('./month.json', item, thirtyDayVol)
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

# Roblox-Average-daily-sales
This is for users who are wanting 30d volume sales with a script. The script uses the sales api data point and calculates the 30 days volume. It writes the data in a json and goes through every item on the catalog. It also finds the average daily sells by dividing the 30 day volume by 30 to get the daily sells.


Setup:
1. You must have node.js installed, it can be installed here: https://nodejs.org/en/download
2. Extract the files in a folder, i recommend your desktop
3. When installed, open command prompt, target your folder you put the code in and write npm i
4. After the loading has completed, write node index.js

Your bot will start.
I do recommend using proxies as there will be less ratelimits, it will work without proxies though. You can add proxies in the proxies.json file in the same format it is in right now.
The bot will write in two files, one will be month.json this will be the total month sales and the other will be daily.json, this will be the average daily sales.

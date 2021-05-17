const express = require('express')
const http = require('http');
const https = require('https');
const cors = require('cors')
const fs = require('fs');

const app = express()

app.disable('etag');

app.listen(8000, () => {
  console.log('Server started!')
})

var path = require('path');

var staticBasePath = './server/static';


//https://stackabuse.com/node-http-servers-for-static-file-serving/
var staticServe = function(req, res) {
    var resolvedBase = path.resolve(staticBasePath);
    var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = path.join(resolvedBase, safeSuffix);
    
    fs.readFile(fileLoc, function(err, data) {
        if (err) {
            res.writeHead(404, 'Not Found');
            res.write('404: File Not Found!');
            return res.end();
        }
        
        res.statusCode = 200;

        res.write(data);
        return res.end();
    });
};

var httpServer = http.createServer(staticServe);

httpServer.listen(8080);

var champs = new Map();
var data = fs.readFileSync('./server/static/dragon/data/en_US/champion.json', 'utf8');
var JsonData = JSON.parse(data);
for (c in JsonData.data) {
	champs.set(JsonData.data[c].key, JsonData.data[c].name);
}

var summonerSpells = new Map();
summonerSpells.set(1, "Boost");
summonerSpells.set(3, "Exhaust");
summonerSpells.set(4, "Flash");
summonerSpells.set(5, "Teleport");
summonerSpells.set(6, "Haste");
summonerSpells.set(7, "Heal");
summonerSpells.set(11, "Smite");
summonerSpells.set(12, "Teleport");
summonerSpells.set(13, "Mana");
summonerSpells.set(14, "Dot");
summonerSpells.set(21, "Barrier");
summonerSpells.set(32, "Snowball");

var api_key = 'RGAPI-9eae8f2d-67de-4f01-9ff1-9288953b3ab2';

app.route('/api/summoner/:name').get((req, res) => {
	var getreq = https.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ req.params.name + "?api_key=" + api_key, function(result) {
		result.on("data", function(chunk) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send(chunk);
			//console.log("BODY: " + chunk);
		});
	});
})

app.route('/api/rank/:id').get((req, res) => {
	var getreq = https.get("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ req.params.id + "?api_key=" + api_key, function(result) {
		result.on("data", function(chunk) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send(chunk);
			//console.log("BODY: " + chunk);
		});
	});
})

app.route('/api/mastery/:id').get((req, res) => {
	var getreq = https.get("https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+ req.params.id + "?api_key=" + api_key, function(result) {
		var body = ""
		result.on("data", function(chunk) {
			body += chunk;
		});
		
		result.on("end", ()=> {
			res.header("Access-Control-Allow-Origin", "*");
			//console.log(body);
			//TODO check that champ name key exists, can break on champ release otherwise
			var JsonMastery = JSON.parse(body)
			for ( c in JsonMastery ) {
				JsonMastery[c].champName = JsonMastery[c].championId ? champs.get(JsonMastery[c].championId.toString()) : "";
				JsonMastery[c].champIcon = JsonMastery[c].championId ? champs.get(JsonMastery[c].championId.toString()).replace(/\s/g, "") : "";
			}
			res.send(JsonMastery);	
		})
	});
})

app.route('/api/matchIds/:id/:startidx/:count').get((req, res) => {
	var getMatchIds = https.get("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + req.params.id + "/ids?start=" + req.params.startidx + "&count=" + req.params.count + "&api_key=" + api_key, function(result) {
		var body = "";
		result.on("data", function (chunk) {
			body += chunk;
		});
		result.on("end", ()=> {
			//console.log(body);
			res.header("Access-Control-Allow-Origin", "*");
			res.send(body);
		})
	});	
})

app.route('/api/matchData/:id').get((req, res) => {
	var getMatchData = https.get("https://americas.api.riotgames.com/lol/match/v5/matches/" + req.params.id + "?api_key=" + api_key, function(result) {
		var body = "";
		var mbody = [];
		var responses = [];
		result.on("data", function (chunk) {
			body += chunk;
		});
		result.on("end", ()=> {
			jsonBody = JSON.parse(body);
			if (jsonBody.info) {
				for (p in jsonBody.info.participants) {
					if (summonerSpells.has(jsonBody.info.participants[p].summoner1Id)) {
						jsonBody.info.participants[p].summoner1Name = summonerSpells.get(jsonBody.info.participants[p].summoner1Id); 
					}
					else {
						jsonBody.info.participants[p].summoner1Name = "Unknown"
					}
					if (summonerSpells.has(jsonBody.info.participants[p].summoner2Id)) {
						jsonBody.info.participants[p].summoner2Name = summonerSpells.get(jsonBody.info.participants[p].summoner2Id); 
					}
					else {
						jsonBody.info.participants[p].summoner2Name = "Unknown"
					}
				}
			}
			res.header("Access-Control-Allow-Origin", "*");
			res.send(jsonBody);
		})
	});	
})
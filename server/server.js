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

var staticBasePath = './static';


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
var data = fs.readFileSync('./static/dragon/data/en_US/champion.json', 'utf8');
var JsonData = JSON.parse(data);
for (c in JsonData.data) {
	champs.set(JsonData.data[c].key, JsonData.data[c].name);
}


app.route('/api/summoner/:name').get((req, res) => {
	var getreq = https.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ req.params.name + "?api_key=RGAPI-c364cd91-3883-4c4a-9338-c2b9adbcf7f3", function(result) {
		result.on("data", function(chunk) {
			res.header("Access-Control-Allow-Origin", "*");
			res.send(chunk);
			console.log("BODY: " + chunk);
		});
	});
})

app.route('/api/mastery/:id').get((req, res) => {
	var getreq = https.get("https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+ req.params.id + "?api_key=RGAPI-c364cd91-3883-4c4a-9338-c2b9adbcf7f3", function(result) {
		var body = ""
		result.on("data", function(chunk) {
			body += chunk;
		});
		
		result.on("end", ()=> {
			res.header("Access-Control-Allow-Origin", "*");
			var JsonMastery = JSON.parse(body)
			for ( c in JsonMastery ) {
				JsonMastery[c].champName = JsonMastery[c].championId ? champs.get(JsonMastery[c].championId.toString()) : "";
				JsonMastery[c].champIcon = JsonMastery[c].championId? champs.get(JsonMastery[c].championId.toString()).replace(/\s/g, "") : "";
			}
			res.send(JsonMastery);	
		})
	});
})



const cheerio = require('cheerio');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongourl = "mongodb://localhost:27017/";
const request = require('request');
const fetch = require("node-fetch")

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MAIN ARRAYS

  var arrayOfPlaceIds = [
    {placeid: '2391643322', clan: 'Noble Blade', category: 'Melee'}, // Fort Tenora
    {placeid: '918219640', clan: 'The Sky Clan of ROBLOX', category: 'Melee'}, // Beach Side Outpost
  ];
  // {placeid: '', clan: '', category: ''}, // 

  var resourceData = [
    {itemid: '4544019605', itemname: 'Secure Sword', imageid: 'https://tr.rbxcdn.com/21d030e4249f8604330f0791010e08e9/420/420/Gear/Png', itemcreator: 'Lametta', itemdesc: 'A sword that sacrifices a little bit of accuracy and smoothness but prevents exploits and major latency issues.'},
    {itemid: '125985896', itemname: 'Bricktops', imageid: 'https://t6.rbxcdn.com/703d2d68a4fd6500869005cf718303ea', itemcreator: 'owen0202', itemdesc: 'A classic map used globally for both practice and scrimmaging; originating from the RCL community.'},
  ];

// FUNCTION TO UPDATE PLACE (USING REQUEST FOR NOW)
function addPlace(placeId, groupName, ctype) {
  let url = `https://www.roblox.com/games/` + placeId + `/-`
  request(url, function (err, response, body) {
    if(err){
       console.log('error!')
    } else {
      if (response.statusCode == 200) {
        const $ = cheerio.load(body)
        var playing = 0
        var maxplayers = 0
     $("p[class='text-lead font-caption-body wait-for-i18n-format-render']").each((i, el) => {
        const item = $(el).text().replace(/,/,'');
        if (i == 0) {
            playing = item;
        } else if (i == 3); {
            maxplayers = item;
        };
     });
        var firstStep = body.lastIndexOf(`carousel-thumb`);
        var secondStep = body.indexOf(`left carousel-control`)
        var modifiedString = body.substring(firstStep + 19, secondStep -30);
        var placeIcon = modifiedString;
        var placeTitle =  $("h2[class='game-name']").text();
        var group = groupName
        updatePlace(placeTitle, group, placeIcon, playing, placeId, ctype)
      }
    }
  });
};

// UPSERT AFTER READING
function updatePlace(placeName, clanName, placeIcon, playing, placeid, category) {
  console.log("Place: " + placeName)
  console.log("Playing: " + playing)
  MongoClient.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("roclans");
    var myquery = { placeid: placeid };
    var newvalues = 
    {$set: {
      placename: placeName,
      clan: clanName,
      playing: playing,
      placeicon: placeIcon,
      placeid: placeid,
      category: category
    }};
    dbo.collection("placedata").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      console.log("Document updated.");
    });
  });
};

// Honestly not even necessary anymore. Simplify later.
// STEP TWO
const functionWithPromise = (placeid, clan, category) => {
  //addPlace(item, "Unknown Clan", "Melee")
  
  return Promise.resolve(addPlace(placeid, clan, category))
};

// STEP ONE
const anAsyncFunction = async item => {
  console.log(item.clan)
  return await(functionWithPromise(item.placeid, item.clan, item.category))
};

// RE-UPDATE ALL
// You can just update through a normal promise now.
const updateAll = async () => {
  return await Promise.all(arrayOfPlaceIds.map(item => anAsyncFunction(item)))
};

let placeData = [];

app.get('/', function (req, res) {
    MongoClient.connect(mongourl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      }, function(err, db) {
      if (err) throw err;
      var dbon = db.db("roclans");
        dbon.collection("placedata").find({}).toArray(function(err, result) {
        if (err) throw err;
        placeData = result;
        placeData.sort(function (knit1, pearl2) {
          if (Number(knit1.playing) > Number(pearl2.playing)) return -1;
          if (Number(knit1.playing) < Number(pearl2.playing)) return 1;
       });
      });
    });
    res.render('index', {
      placeData: placeData,
    });
  });

  app.get('/resources', function (req, res) {
    resourceData = resourceData
    res.render('resources', {
      resourceData: resourceData,
    });
  });

  app.get('/community', function (req, res) {
    res.render('community', {
    });
  });

  app.get('/api/commapp', function(req, res) {
    res.render('commapp', {})
  });

app.post('/api/commapp', function(req, res) {
  res.render('commapp', {})
  var Token = req.body.token
  var Destination = "https://discordapp.com/api/webhooks/" + Token
  var Content = "Error"
  if (req.body.rocode == "109492") {
    Content = req.body.msg
  }
  var Message = {
    "content": Content
    }
  fetch(Destination + "?wait=true", 
  {"method":"POST", "headers": {"content-type": "application/json"},
  "body": JSON.stringify(Message)})
  .then(a=>a.json()).then(console.log)
});

function fn60sec() {
  updateAll()
};

  app.listen(80, function () {
  });

fn60sec();
setInterval(fn60sec, 60*1000);
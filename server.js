
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const axios = require("axios");
const request = require('request');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MAIN ARRAYS

  var arrayOfPlaceIds = [
    {placeid: '2391643322', clan: 'Noble Blade', category: 'Melee'}, // Fort Tenora
    {placeid: '2454651094', clan: 'Frost Clan', category: 'Ranged'}, // Fort Wolf
    {placeid: '918219640', clan: 'The Sky Clan of ROBLOX', category: 'Melee'}, // Beach Side Outpost
    {placeid: '1095430150', clan: 'Team Domino', category: 'Melee'}, // Fort Aamon III
    {placeid: '2742930668', clan: 'The Vaktovian Empire', category: 'Ranged'}, // The Azukan Mines DT
    {placeid: '454834811', clan: 'Frost Clan', category: 'Melee'}, // Wolves' Borough
    {placeid: '253616963', clan: 'Skilled Force', category: 'Melee'}, // Stronghold Lexus II
    {placeid: '794460657', clan: 'Skilled Force', category: 'Melee'}, // Outpost Aquarius
    {placeid: '2578133852', clan: 'Federation of Arcadia', category: 'Ranged'}, // Stronghold 2
    {placeid: '1144829704', clan: 'Federation of Arcadia', category: 'Ranged'}, // Shield World Novaan
    {placeid: '3494948565', clan: 'Federation of Arcadia', category: 'Ranged'}, // Greytower
    {placeid: '1476001068', clan: 'The Robloxian Army TRA', category: 'Ranged'}, // Fort Rana
    {placeid: '1542281150', clan: 'The Robloxian Army TRA', category: 'Melee'}, // Castle Beaumont
    {placeid: '2389049159', clan: 'The First Encounter Assault Recon', category: 'Ranged'}, // Outpost Zorah
    {placeid: '1399941230', clan: 'Prime Legion', category: 'Melee'}, // Province of Mulai Takuli
    {placeid: '1572904362', clan: 'Nighthawk Commandos', category: 'Ranged'}, // Arcon III
    {placeid: '3361514572', clan: 'Aegis Core', category: 'Ranged'}, // Stronghold Solum II
    {placeid: '834559339', clan: 'Aegis Core', category: 'Ranged'}, // Aetrio
    {placeid: '2265310660', clan: 'Unstable', category: 'Melee'}, // Mizumi
    {placeid: '3284380663', clan: 'Royal Blood', category: 'Melee'}, // Valoris
    {placeid: '1300881179', clan: 'Nieve', category: 'Melee'}, // Korr
    {placeid: '1460983382', clan: 'Presage', category: 'Melee'}, // 
    {placeid: '1277238693', clan: 'Mesmer', category: 'Ranged'}, // Azuremyst Fortification
    {placeid: '3019726111', clan: 'Mesmer', category: 'Ranged'}, // Siege of Talador
    {placeid: '3900002819', clan: 'Mesmer', category: 'Ranged'}, // Saron
    {placeid: '2110701218', clan: 'Aeissen', category: 'Melee'}, // Xylithe
    {placeid: '2753637156', clan: 'Avelon', category: 'Melee'}, // Almace
    {placeid: '406932069', clan: 'Black Wolf Empire', category: 'Melee'}, // Wolf Den
    {placeid: '331295568', clan: 'Cobalt Nation', category: 'Melee'}, // Fortress Grotto
    {placeid: '3325475755', clan: 'Royal Invictus', category: 'Melee'}, // Olympian Harbour
    {placeid: '3585777883', clan: 'Royal Invictus', category: 'Melee'}, // Visari
    {placeid: '412064806', clan: 'Skill Nation', category: 'Melee'}, // Novus Ortus
    {placeid: '3080470331', clan: 'Team Domino', category: 'Melee'}, // Orios Stronghold
    {placeid: '1318771501', clan: 'Vextuis Supremacy', category: 'Melee'}, // Crucible III
    {placeid: '1503028075', clan: 'Vextuis Supremacy', category: 'Melee'}, // Crucible IV
    {placeid: '520149818', clan: 'Urban Assault Forces', category: 'Ranged'}, // Kopervich
    {placeid: '2518219171', clan: 'Urban Assault Forces', category: 'Ranged'}, // Plateworks
    {placeid: '688059792', clan: 'Urban Assault Forces', category: 'Ranged'}, // Namak Wetlands
    {placeid: '257784240', clan: 'United Clan of ROBLOX', category: 'Ranged'}, // Oriion
    {placeid: '704633176', clan: 'United Clan of ROBLOX', category: 'Ranged'}, // Horizon
    {placeid: '2088996132', clan: 'United Clan of ROBLOX', category: 'Melee'}, // Gemini
    {placeid: '584563589', clan: '[-Professional Ironed Force-]', category: 'Melee'}, // Zervius
    {placeid: '2496687533', clan: 'Daedalus Senate', category: 'Ranged'}, // Stronghold Reaven
    {placeid: '4026700649', clan: 'â€» Myth Reserve Forces â€»', category: 'Ranged'}, // City of Ersaiv
  ];
  // {placeid: '', clan: '', category: ''}, // 

  var resourceData = [
    {itemid: '4544019605', itemname: 'Community Sword', imageid: 'https://t4.rbxcdn.com/83eabeabf2e0ecf8a190a1320308213b', itemcreator: 'Lametta', itemdesc: 'A sword created by Lametta for the clan community. The sword sacrifices aesthetics, but prevents fatal exploits and offers a variety of options.'},
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
  MongoClient.connect(url, {
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
    MongoClient.connect(url, {
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
  console.log(req.url)
  var Destination = "https://discordapp.com/api/webhooks/675231361585381397/7XeCLyJMJ_qD-9i1KDBE8YStP49JfpRpJxvRDPlNevLTX2BENysAhdk8ldgZAuw9ieN4"
  var Message = "You have posted to the website properly!"
  fetch(Destination + "?Wait=true", 
  {"method":"POST", "headers": {"content-type": "application/json"},
  "body": JSON.stringify(Message)})
  .then(a=>a.json()).then(console.log)
});
  
  app.listen(443, function () {
    console.log('Port listening on HTTPS.')
  });

  app.listen(80, function () {
    console.log('Port listening globally.')
  });

  function fn60sec() {
    updateAll()
  };

fn60sec();
setInterval(fn60sec, 60*1000);
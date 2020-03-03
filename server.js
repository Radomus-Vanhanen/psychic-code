
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
    {placeid: '1647005353', clan: 'Noble Blade', category: 'Melee / Ranged'}, // Section Delta
    {placeid: '1476001068', clan: 'The Robloxian Army', category: 'Ranged'}, // Fort Rana
    {placeid: '1542281150', clan: 'The Robloxian Army', category: 'Melee'}, // Fort Beaumont
    {placeid: '2007110262', clan: 'The Vaktovian Army', category: 'Ranged'}, // Port Maersk [EASY MODE]
    {placeid: '2797046423', clan: 'The Vaktovian Army', category: 'Ranged'}, // The Azukan Mines [EASY MODE]
    {placeid: '4026700649', clan: 'Myth Reserve Forces', category: 'Ranged'}, // City of Ersaiv
  ];
  // {placeid: '', clan: '', category: ''}, // 

  var resourceData = [
    {itemid: '4544019605', itemname: 'RoClans Sword', imageid: 'https://tr.rbxcdn.com/21d030e4249f8604330f0791010e08e9/420/420/Gear/Png', itemcreator: 'Lametta', itemdesc: 'A customizable sword that prevents certain exploits and many latency related issues.'},
    {itemid: '125985896', itemname: 'Bricktops', imageid: 'https://t6.rbxcdn.com/703d2d68a4fd6500869005cf718303ea', itemcreator: 'owen0202', itemdesc: 'A classic map used globally for both practice and scrimmaging; originating from the RCL community.'},
    {itemid: '543918030', itemname: 'Uniformed', imageid: 'https://images.squarespace-cdn.com/content/v1/5c4afa007c9327f7a221518f/1548706752190-4CR2TPGRBNUU5WOOW8JC/ke17ZwdGBToddI8pDm48kBhs0kXmJu3pAC_LFF99rKVZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7eaDBaxyzPPG4B3J3_Z93rYLky5fjRrZeLmMK3F2aytfjfg4x4lXesDnM4MUpb-Vdw/scroll_128.png', itemcreator: 'Partixel', itemdesc: 'A uniform selection system. More information here: https://devforum.roblox.com/t/uniformed-a-free-opensource-fe-compatable-uniform-selection-system/63923'},
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

  app.listen(1337, function () { // the only port for lametta ofc
  });

fn60sec();
setInterval(fn60sec, 60*1000);
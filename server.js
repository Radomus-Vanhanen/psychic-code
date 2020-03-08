
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
    {placeid: '1399941230', clan: 'Prime Legion', category: 'Melee'}, // Province of Mulai
    {placeid: '2036637970', clan: 'Nightfall Clan', category: 'Ranged'}, // Fortress Noctem
    {placeid: '257784240', clan: 'United Clan of ROBLOX', category: 'Ranged'}, // Oriion
    {placeid: '704633176', clan: 'United Clan of ROBLOX', category: 'Ranged'}, // Horizon
    {placeid: '2589348835', clan: 'RSF', category: 'Ranged'}, // Galileo
    {placeid: '3262357086', clan: 'RSF', category: 'Ranged'}, // Arduous
    {placeid: '3366185558', clan: 'RSF', category: 'Ranged'}, // Arvore
    {placeid: '2890894136', clan: 'RSF', category: 'Melee'}, // Battlefield Zone
    {placeid: '2351730401', clan: 'RSF', category: 'Ranged'}, // Gulian Gorge
    {placeid: '331295568', clan: 'Cobalt Nation', category: 'Melee'}, // Fortress Grotto
    {placeid: '2341328394', clan: 'Cobalt Nation', category: 'Melee'}, // Valerius
    {placeid: '2337204126', clan: 'Team Domino', category: 'Melee'}, // Bayfront Harbor
    {placeid: '2578133852', clan: 'Federation of Arcadia', category: 'Ranged'}, // 
    {placeid: '1144829704', clan: 'Federation of Arcadia', category: 'Ranged'}, // Shield World Novaan
    {placeid: '3274071190', clan: 'The Tempus Imperium', category: 'Ranged'}, // Outpost Sik
    {placeid: '4222766350', clan: 'Sigmarite Empire', category: 'Ranged'}, // Sataur Valley
    {placeid: '3482144906', clan: 'Petras Liberation Front', category: 'Ranged'}, // Watchpoint Gibraltar
    {placeid: '4572194478', clan: 'United Clan of ROBLOX', category: 'Melee'}, // Outpost Leo
    {placeid: '398361701', clan: 'The Dark Warriors.', category: 'Melee'}, // Celvestia's Resurgence
    {placeid: '409431042', clan: 'The Dark Warriors.', category: 'Melee'}, // Uada's Forest
    {placeid: '4484427399', clan: '|| Imperial Armada ||', category: 'Ranged'}, // Arcannian Frontier III
    {placeid: '4480472063', clan: 'United States Armed Forces [USA]', category: 'Ranged'}, // Port Jackson
    {placeid: '4399974518', clan: 'Petras Liberation Front', category: 'Ranged'}, // Apec Command Post
    {placeid: '2936078317', clan: 'Itvara', category: 'Melee'}, // Cosm
    {placeid: '4127239925', clan: 'Fallen Defenders', category: 'Melee'}, // Kratos Core
    {placeid: '834559339', clan: 'Aegis Core', category: 'Ranged'}, // Aegis Aetrio
    {placeid: '810662312', clan: 'Aegis Core', category: 'Ranged'}, // Sapphire Compound
    {placeid: '443736620', clan: 'The Dark Warriors.', category: 'Melee'}, // Original Capital
    {placeid: '1779037701', clan: 'Combat Assault Team', category: 'Ranged'}, // Baseline 57
    {placeid: '4558745672', clan: 'The Vykterrian Dominion', category: 'Ranged'}, // The Docks
    {placeid: '3325353137', clan: 'Ascarian Insurgency', category: 'Melee'}, // Port Venterus
    {placeid: '4757026121', clan: 'The Vykterrian Dominion', category: 'Ranged'}, // The Bio-Lab
    {placeid: '4742160743', clan: 'Avidya', category: 'Melee'}, // Defiance
  ];
  // {placeid: '', clan: '', category: ''}, // 

  var resourceData = [
    {itemid: '4544019605', itemname: 'RoClans Sword', imageid: 'https://tr.rbxcdn.com/21d030e4249f8604330f0791010e08e9/420/420/Gear/Png', itemcreator: 'Lametta', itemdesc: 'A customizable sword that prevents certain exploits and many latency related issues.'},
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
    var Destination = "https://discordapp.com/api/webhooks/686171187428327435/aHZkixYHKkT3FsJxipO4MsLXoFrhqirt-UBzCOkR2ePeT9CP5-4e7N0pnAmPJRmOUhLR"
    var Content = "Forts have been loaded..."
    var Message = {
      "content": Content
      }
    fetch(Destination + "?wait=true", 
    {"method":"POST", "headers": {"content-type": "application/json"},
    "body": JSON.stringify(Message)})
    .then(a=>a.json()).then(console.log)
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
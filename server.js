
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
    {placeid: '1647005353', clan: 'Noble Blade', category: 'Melee / Ranged', acr: 'NB'}, // Section Delta
    {placeid: '1476001068', clan: 'The Robloxian Army', category: 'Ranged', acr: 'TRA'}, // Fort Rana
    {placeid: '1542281150', clan: 'The Robloxian Army', category: 'Melee', acr: 'TRA'}, // Fort Beaumont
    {placeid: '2007110262', clan: 'The Vaktovian Army', category: 'Ranged', acr: 'VAK'}, // Port Maersk [EASY MODE]
    {placeid: '2797046423', clan: 'The Vaktovian Army', category: 'Ranged', acr: 'VAK'}, // The Azukan Mines [EASY MODE]
    {placeid: '4026700649', clan: 'Myth Reserve Forces', category: 'Ranged', acr: 'MRF'}, // City of Ersaiv
    {placeid: '1399941230', clan: 'Prime Legion', category: 'Melee', acr: 'PL'}, // Province of Mulai
    {placeid: '2036637970', clan: 'Nightfall Clan', category: 'Ranged', acr: 'NFC'}, // Fortress Noctem
    {placeid: '257784240', clan: 'United Clan of ROBLOX', category: 'Ranged', acr: 'UCR'}, // Oriion
    {placeid: '704633176', clan: 'United Clan of ROBLOX', category: 'Ranged', acr: 'UCR'}, // Horizon
    {placeid: '2589348835', clan: 'RSF', category: 'Ranged', acr: 'RSF'}, // Galileo
    {placeid: '3262357086', clan: 'RSF', category: 'Ranged', acr: 'RSF'}, // Arduous
    {placeid: '3366185558', clan: 'RSF', category: 'Ranged', acr: 'RSF'}, // Arvore
    {placeid: '2890894136', clan: 'RSF', category: 'Melee', acr: 'RSF'}, // Battlefield Zone
    {placeid: '2351730401', clan: 'RSF', category: 'Ranged', acr: 'RSF'}, // Gulian Gorge
    {placeid: '331295568', clan: 'Cobalt Nation', category: 'Melee', acr: 'CN'}, // Fortress Grotto
    {placeid: '2341328394', clan: 'Cobalt Nation', category: 'Melee', acr: 'CN'}, // Valerius
    {placeid: '2337204126', clan: 'Team Domino', category: 'Melee', acr: 'TD'}, // Bayfront Harbor
    {placeid: '2578133852', clan: 'Federation of Arcadia', category: 'Ranged', acr: 'FoA'}, // 
    {placeid: '1144829704', clan: 'Federation of Arcadia', category: 'Ranged', acr: 'FoA'}, // Shield World Novaan
    {placeid: '3274071190', clan: 'The Tempus Imperium', category: 'Ranged', acr: 'TTI'}, // Outpost Sik
    {placeid: '4222766350', clan: 'Sigmarite Empire', category: 'Ranged', acr: 'SE'}, // Sataur Valley
    {placeid: '3482144906', clan: 'Petras Liberation Front', category: 'Ranged', acr: 'PLF'}, // Watchpoint Gibraltar
    {placeid: '4572194478', clan: 'United Clan of ROBLOX', category: 'Melee', acr: 'UCR'}, // Outpost Leo
    {placeid: '398361701', clan: 'The Dark Warriors.', category: 'Melee', acr: 'TDW'}, // Celvestia's Resurgence
    {placeid: '409431042', clan: 'The Dark Warriors.', category: 'Melee', acr: 'TDW'}, // Uada's Forest
    {placeid: '4484427399', clan: 'Imperial Armada', category: 'Ranged', acr: 'IA'}, // Arcannian Frontier III
    {placeid: '4480472063', clan: 'United States Armed Forces [USA]', category: 'Ranged', acr: "USAF"}, // Port Jackson
    {placeid: '4399974518', clan: 'Petras Liberation Front', category: 'Ranged', acr: 'PLF'}, // Apec Command Post
    {placeid: '2936078317', clan: 'Itvara', category: 'Melee', acr: 'Itvara'}, // Cosm
    {placeid: '4127239925', clan: 'Fallen Defenders', category: 'Melee', acr: 'FD'}, // Kratos Core
    {placeid: '834559339', clan: 'Aegis Core', category: 'Ranged', acr: 'AC'}, // Aegis Aetrio
    {placeid: '810662312', clan: 'Aegis Core', category: 'Ranged', acr: 'AC'}, // Sapphire Compound
    {placeid: '443736620', clan: 'The Dark Warriors.', category: 'Melee', acr: 'TDW'}, // Original Capital
    {placeid: '1779037701', clan: 'Combat Assault Team', category: 'Ranged', acr: 'CAT'}, // Baseline 57
    {placeid: '4558745672', clan: 'The Vykterrian Dominion', category: 'Ranged', acr: 'TVD'}, // The Docks
    {placeid: '3325353137', clan: 'Ascarian Insurgency', category: 'Melee', acr: 'AI'}, // Port Venterus
    {placeid: '4757026121', clan: 'The Vykterrian Dominion', category: 'Ranged', acr: 'TVD'}, // The Bio-Lab
    {placeid: '4742160743', clan: 'Avidya', category: 'Melee', acr: 'Avidya'}, // Defiance
    {placeid: '4566279544', clan: 'Order of the Crimson Eagle', category: 'Ranged', acr: 'OCE'}, // Eltran Front
    {placeid: '4754639529', clan: 'The Robloxian Army', category: 'Ranged', acr: 'TRA'}, // Outpost Frostbite
    {placeid: '4035627462', clan: 'Dark Royal Military', category: 'Ranged', acr: 'DRM'}, // Warehouse
    {placeid: '4535194097', clan: 'Immortal Robloxian Federation', category: 'Ranged', acr: 'IRF'}, // Port Kehl
    {placeid: '4649719641', clan: 'The Steel Gladium', category: 'Ranged', acr: 'TSG'}, // Marine Island Outpost
    {placeid: '4695573161', clan: 'Solar Nation', category: 'Melee', acr: 'SN'}, // Nova Port
    {placeid: '4097416512', clan: 'Mesmer', category: 'Melee', acr: 'MSMR'}, // Frost Dragon
    {placeid: '3684242877', clan: 'Ravager Ascendancy', category: 'Melee', acr: 'RA'}, // Outpost Ravage
    {placeid: '1123837929', clan: 'Cryptic Legion', category: 'Melee', acr: 'CL'}, // Fort Cryptonium
    {placeid: '1887750243', clan: 'Perma Frost', category: 'Melee', acr: 'PF'}, // Advection
    {placeid: '3160652466', clan: 'Crimson Edge', category: 'Melee', acr: 'CE'}, // Fort Blood Shred
    {placeid: '358183927', clan: 'The Bear Supremacy', category: 'Ranged', acr: 'BEAR'}, // Stronghold Union
    {placeid: '3697873275', clan: 'Valania', category: 'Ranged', acr: 'VAL'}, // Ceresian Moss
    {placeid: '1431624473', clan: 'The Bear Supremacy', category: 'Ranged', acr: 'BEAR'}, // Ancient Temple
    {placeid: '1277238693', clan: 'Mesmer', category: 'Ranged', acr: 'MSMR'}, // Azuremyst
    {placeid: '3900002819', clan: 'Mesmer', category: 'Ranged', acr: 'MSMR'}, // Saron
    {placeid: '3019726111', clan: 'Mesmer', category: 'Ranged', acr: 'MSMR'}, // Siege of Talador
    {placeid: '3128412043', clan: 'Delta Regiment', category: 'Ranged', acr: 'DELTA'}, // Stronghold Avena
    {placeid: '4689765421', clan: 'Darkheart Military', category: 'Melee', acr: 'DM'}, // Kyrel
    {placeid: '4746083655', clan: 'Imperial Armada', category: 'Ranged', acr: 'IA'}, // Nova District
    {placeid: '2389049159', clan: 'The First Encounter Assault Recon', category: 'Ranged', acr: 'FEAR'}, // Outpost Zorah
    {placeid: '3080470331', clan: 'Team Domino', category: 'Melee', acr: 'TD'}, // Orios Keep
    {placeid: '1427580544', clan: 'The WIJ Alliance', category: 'Ranged', acr: 'WIJ'}, // Cerulean II
    {placeid: '1427493600', clan: 'The WIJ Alliance', category: 'Ranged', acr: 'WIJ'}, // Indigo II
    {placeid: '4065273310', clan: 'The Prime Syndicate', category: 'Ranged', acr: 'PRIME'}, // Erebus Mines
    {placeid: '4690481102', clan: 'Aztecian Sovereignty', category: 'Ranged', acr: 'AZTEC'}, // Tenox II
    {placeid: '4604275637', clan: 'Dark Militia', category: 'Ranged', acr: 'DM'}, // Dark Forge
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

/*const asyncOfData = async () => {
  return await 
}*/

let placeData = [];
let enteredAfterUpdate = 0

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
    enteredAfterUpdate = enteredAfterUpdate + 1
    var Content = "RoClans has been visited " + enteredAfterUpdate + " times after the last update."
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
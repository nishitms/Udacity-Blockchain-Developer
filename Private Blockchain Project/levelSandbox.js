/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key,value){
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}


// Get data from levelDB with key
function getLevelDBData(key){
    return db.get(key)
}

// Add data to levelDB with value
function addDataToLevelDB(value) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

function getAllLevelDBData() {
    let i = 0;
    db.createReadStream().on('data', function(data) {
          console.log(data.key, '=', JSON.parse(data.value))
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Closing blockchain');
          //addLevelDBData(i, value);
        });
}


// exports the variables and functions above so that other modules can use them
module.exports.addLevelDBData = addLevelDBData;  
module.exports.getAllLevelDBData = getAllLevelDBData;
module.exports.getLevelDBData = getLevelDBData;  
module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.level = level;  
module.exports.chainDB = chainDB;  
module.exports.db = db;  

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

/*
(function theLoop (i) {
  setTimeout(function () {
    addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);
*/
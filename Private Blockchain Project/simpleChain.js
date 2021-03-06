/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const levelSandbox = require('./levelSandbox.js')

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    let newBlockJsonString = JSON.stringify(newBlock);
    // Adding block object to chain
  	this.chain.push(newBlock);
    levelSandbox.addLevelDBData(newBlock.height,newBlockJsonString);
  }

  // Get block height
    getBlockHeight(){
      //return this.chain.length-1;
      let countHeight = 0;
      levelSandbox.db.createReadStream().on('data', function(data) {
          //console.log(data.key, '=', JSON.parse(data.value))
          countHeight++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          //console.log('Closing blockchain');
          //addLevelDBData(i, value);
          //console.log(countHeight)
          return countHeight
        });
        //console.log(countHeight)
    }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      //return JSON.parse(JSON.stringify(this.chain[blockHeight]));
      //console.log("Type simple = ", typeof levelSandbox.getLevelDBData(blockHeight));
      levelSandbox.getLevelDBData(blockHeight)
      .then(function(value){
      //console.log("Type = ", typeof value)
      //console.log("Value = ", value)
      return value
      })
      .catch(function(err){console.log('Not found!', err)})
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

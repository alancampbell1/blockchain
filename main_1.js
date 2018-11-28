/*
	This is the first example of a Basic Blockchain. It is missing several
	key features but demonstrates the basic idea of creating a blockchain,
	adding blocks to it, calculating the block's hash values and verifying
	if the block has been tampered with.
*/

//importing the sha256 function to calculate a hash value
const SHA256 = require('crypto-js/sha256');

//defining what a block on the blockchain will look like
class Block{
	/*
		This constructor will receive the properties of this block.
		'index' is optional and tells us where the block sits on the chain
		'timestamp' tells us when the block was created
		'data' any type of data you want associated with this block
		'previousHash' the unique idenifier of the block before the current one
		'hash' calls the calculateHash() function and returns the unique ID for this block
	*/
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	//This function will calculate the Hash for this Block
	calculateHash(){
		//we are using sha256 to calculate our Hash Value
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

//This class will define our Blockchain
class Blockchain{
	//constructor is responsible for initialising our Blockchain
	constructor(){
		//chain will be an Array of Blocks, starting with the Genesis Block
		this.chain = [this.createGenesisBlock()];
	}

	//manually creating the Genesis Block
	createGenesisBlock(){
		return new Block(0, '01/01/2018', "Genesis Block", "0");
	}

	//return the latest block in the chain
	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	//this function adds a new block to the chain
	addBlock(newBlock){
		//Set the Hash of the previous last block to previousHash value of this new Block
		newBlock.previousHash = this.getLatestBlock().hash;
		//Because we re-set the previousHash value we must now also re-set its initial Hash value again
		newBlock.hash = newBlock.calculateHash(); 
		//pushing this newBlock onto the chain, i.e. onto the Array of Blocks
		this.chain.push(newBlock);
	}

	//this function will return true or false depending on if the chain is valid
	//A valid chain is one that has not been edited
	isChainValid(){
		//looping through the chain, not starting at the Genesis Chain
		for(let i = 1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			/*
				if the block has been edited, its hash would have changed.
				So, if the current block's hash is not equal to the returned 
				value of the current block calling calculateHash() then false
				will be returned, aka the block is not valid
			*/
			if(currentBlock.hash != currentBlock.calculateHash()){
				return false;
			}

			//if our current block's previousHash does not equal the previous block's hash
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		//no issues found
		return true;
	}
}

//empty blockchain created
let alanCoin = new Blockchain();
//two blocks added
alanCoin.addBlock(new Block(1, "14/10/2018", { amount : 4 }));
alanCoin.addBlock(new Block(2, "15/10/2018", { amount : 10 }));

console.log("Is Blockchain valid? " + alanCoin.isChainValid());

//Printing the contents of the Blockchain
console.log(JSON.stringify(alanCoin, null, 4));

//making a change block 2 - changing its data
alanCoin.chain[1].data = { amount: 100 };
//recalculating its hash
alanCoin.chain[1].hash = alanCoin.chain[1].calculateHash();

console.log("Is Blockchain valid? " + alanCoin.isChainValid());



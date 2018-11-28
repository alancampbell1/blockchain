/*
	This Blockchain builds upon the previous one but adds a 'Proof of Work'
	mechanism that forces a period of time to be passed before adding a
	block to the blockchain
*/

//importing the crypto-js dependency
const SHA256 = require('crypto-js/sha256');

//defining what a block on the blockchain will look like
class Block{
	/*
		'index' tells us where the block sits on the chain
		'timestamp' tells us when the block was created
		'data' tells us the data associated with this block, e.g. money transferred, sender/receiver
		'previousHash' is a String containing the hash of the block before the current one. This is
		very important as it ensures the integrity of the blockchain
		'nonce' is a random value. In mineBlock, we cannot add the additional zeros to the start of the
		hash unless the block itself has been modified. A work around is added an additional variable, with
		no meaning, and edit it each time before a zero is allowed to be added.
	*/

	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	//function to calculate the hash function of this block
	calculateHash(){
		//it will take the properties of this function, run them through a hash function
		//and return the hash, used to identify the hash.
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}

	/*
		This function demonstrates 'Proof of Work'/'Mining'. This mechanism
		is to prove you put alot of computing power into making a block and
		stop thousands of blocks being made instantly, i.e. spamming.
		The purpose of this function is to make our block's hash begin with a certain amount
		of zeros depending on the difficulty variable passed in. This comes from Bitcoin's requirement
		that their hash codes must begin with a certain amount of zeros. This, combined with the hash code
		itself makes editing incrediably difficult.
	*/

	//The difficulty variable indicates the length of time to create a block
	mineBlock(difficulty){
		/*
			This while loop will continue to run until we have enough zeros to match the difficulty.
		*/
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			//editing nonce to allow calculateHash() to get the approapriate zeros
			this.nonce++;
			this.hash = this.calculateHash();
		}
		//printing the new hash of the block just mined, i.e. added enough zeros to.
		console.log("Block mined: " + this.hash);
	}
}

//class to define Blockchain
class Blockchain{
	//constructor is responsible for initialising the blockchain
	constructor(){
		//initialising the chain array
		this.chain = [this.createGensisBlock()];
		this.difficulty = 4;
	}
	//method to create the first block, aka the Genesis Block
	createGensisBlock(){
		return new Block(0, '01/01/2018', "Genesis Block", "0");
	}

	//method to return the last chain in the block
	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	//method to add a new block to the blockchain
	addBlock(newBlock){
		//first: set the previousHash value of the new block to the hash of the last block in the chain
		newBlock.previousHash = this.getLatestBlock().hash;
		//calling the mineBlock function, passing a difficulty value/time limit, to mine the block before pushing it onto the chain
		newBlock.mineBlock(this.difficulty);
		//add this new block to the chain
		this.chain.push(newBlock);
	}

	isChainValid(){
		//looping through the chain but not starting at the genesis block
		for(let i = 1; i < this.chain.length; i++){
			//storing value of current block
			const currentBlock = this.chain[i];
			//storing value of the previous block
			const previousBlock = this.chain[i - 1];

			//checking if the hash of the current block is not equal to the hash calculated
			if(currentBlock.hash != currentBlock.calculateHash()){
				return false;
			}

			//checking if the current block's previousHash value is equal to the previousBlock's hash value
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		//no issues found
		return true;
	}
}

//new blockchain created
let alanCoin = new Blockchain();
console.log('Mining Block 1...');
//new block added that is mined, aka taken a period of time before being added
alanCoin.addBlock(new Block(1, "14/10/2018", {amount: 4}));
console.log('Mining Block 2...');
alanCoin.addBlock(new Block(2, "15/10/2018", {amount: 9}));
console.log('Mining Block 3...');
alanCoin.addBlock(new Block(3, "16/10/2018", {amount: 2}));


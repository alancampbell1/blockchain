/*
	This code builds upon the previous example by making this blockchain
	a simple cryptocurrency.
	This version makes it mandatory for transactions to be signed with a
	private and public key. This way, you can only spend money you have if
	you have the private key.
*/

//importing the crypto-js dependency
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}

	//return the sha256 hash of this transaction- this hash is what we will sign with our private key
	calculateHash(){
		return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
	}

	//to sign a transaction we must give our private and public key.
	//signingKey is the object we get from our elliptic library
	signTransaction(signingKey){
		//check if public key equals fromAddress
		if(signingKey.getPublic('hex') !== this.fromAddress){
			throw new Error('You cannot sign transactions for other wallets');
		}

		const hashTx = this.calculateHash();
		const sign = signingKey.sign(hashTx, 'base64');
		this.signature = sign.toDER('hex');
	}

	isValid(){
		//if the fromAddress is null
		if(this.fromAddress === null) return true;

		//check if there is a signature
		if(!this.signature || this.signature.length === 0){
			throw new Error('No signature in this transaction');
		}

		//If there is a signature, extract the publicKey from it
		const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
		//Verify if transaction has been signed by that key
		return publicKey.verify(this.calculateHash(), this.signature);
	}
}


//defining what a block on the blockchain will look like
class Block{
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
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
	*/
	mineBlock(difficulty){
		/*
			This while loop will continue to run until we have enough zeros to match the difficulty.
		*/
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			//incrementing nonce as long as our hash doesn't start with enough zeros
			this.nonce++;
			this.hash = this.calculateHash();
		}
		//printing the new hash of the block just mined, i.e. added enough zeros to.
		console.log("Block mined: " + this.hash);
	}

	//this method validates all transactions in the current block
	//remember a block can contain multiple transactions
	hasValidTransactions(){
		for(const tx of this.transactions){
			if(!tx.isValid()){
				return false
			}
		}
		return true;
	}
}

//class to define Blockchain
class Blockchain{
	//constructor is responsible for initialising the blockchain
	constructor(){
		//initialising the chain array
		this.chain = [this.createGensisBlock()];
		this.difficulty = 2;
		//we only create blocks on a specific interval, e.g. Bitcoin's 'Proof of Work' algorithm means 1 bitcoin per 10mins. 
		//pendingTransactions stores transactions waiting for 'Proof of Work' time period to pass
		this.pendingTransactions = [];
		//defining a property that will control how much coins the miners get as rewards.
		this.miningReward = 100;

	}
	//method to create the first block, aka the Genesis Block
	createGensisBlock(){
		return new Block(Date.parse("14-10-2018"), [], "0");
	}

	//method to return the last chain in the block
	getLatestBlock(){
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress){
		const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
		this.pendingTransactions.push(rewardTx);

		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		block.mineBlock(this.difficulty);

		console.log('Block successfully mined');
		this.chain.push(block);

		this.pendingTransactions = [];
	}

	//function that takes a transaction and puts it ont the pendingTransaction's array
	addTransaction(transaction){
		//check if fromAddress and toAddress are filled in
		if(!transaction.fromAddress || !transaction.toAddress){
			throw new Error('Transaction must include from and to address');
		}
		//verify that the transaction we want to add is valid
		if(!transaction.isValid()){
			throw new Error('Cannot add invalid transaction to chain');
		}

		this.pendingTransactions.push(transaction);
	}

	//To determine your balance, you need to look into each block with your address
	getBalanceOfAddress(address){
		let balance = 0;
		for(const block of this.chain){
			for(const trans of block.transactions){
				//if you sent money, deduce from balance
				if(trans.fromAddress === address){
					balance -= trans.amount;
				}
				//if money was sent to you, add to balance
				if(trans.toAddress === address){
					balance += trans.amount;
				}
			}
		}

		return balance;
	}

	isChainValid(){
		//looping through the chain but not starting at the genesis block
		for(let i = 1; i < this.chain.length; i++){
			//storing value of current block
			const currentBlock = this.chain[i];
			//storing value of the previous block
			const previousBlock = this.chain[i - 1];

			if(!currentBlock.hasValidTransactions()){
				return false;
			}
			//checking if the hash of the current block is not equal to the hash calculated
			if(currentBlock.hash !== currentBlock.calculateHash()){
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

//exporting the Blockchain and Transaction objects
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;


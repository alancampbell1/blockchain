/*
	This code builds upon the previous example by making this blockchain
	a simple cryptocurrency.
	We are going to do this by making a block contain multiple transactions.
	We are also goig to add rewards for miners.
	Why add rewards for those that add blocks to the Blockchain? For a 
	cryptocurrency to work you need to introduce coins into the system. By offering
	rewards to miners, 'Mining Rewards', we steadily introduce new coins into the
	cryptocurrency system.
*/

//importing the crypto-js dependency
const SHA256 = require('crypto-js/sha256');

/*
	Replacing 'data' in each block is now Transaction. An object that contains three
	variables relating to transaction information.
	'fromAddress' - a transaction from someone
	'toAddress' - a transaction goes to someone
	'amount' - how many coins are transferred
*/
class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
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

	//function to calculate the hash function of each block
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
}

//class to define Blockchain
class Blockchain{
	//constructor is responsible for initialising the blockchain
	constructor(){
		this.chain = [this.createGensisBlock()];
		this.difficulty = 2;
		//we only create blocks on a specific interval, e.g. Bitcoin's 'Proof of Work' algorithm means 1 bitcoin per 10mins. 
		//pendingTransactions stores transactions waiting for 'Proof of Work' time periods to pass
		this.pendingTransactions = [];
		//defining a property that will control how much coins the miners get as rewards for each block mined.
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

	/*
		When a miner calls this function, it will pass along its wallet address and say
		if I successfully mine this block, then send the reward to this address.
	*/
	minePendingTransactions(miningRewardAddress){
		//new Transaction object created with variables passed including the miningReward
		const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
		//Transaction object pushed onto the pendingTransactions Array
		this.pendingTransactions.push(rewardTx);
		//new block created that stores the Transactions object as its piece of data
		let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
		//This block is then mined using a specified difficulty level
		block.mineBlock(this.difficulty);
		console.log('Block successfully mined');
		//Block then added to Blockchain after period of time
		this.chain.push(block);
		//Transactions is set back to empty for the next 
		this.pendingTransactions = [];
	}

	//function that takes a transaction and puts it onto the pendingTransaction's array
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}

	//To determine your balance, you need to look into each block with your address and +/- when necessary
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

let alanCoin = new Blockchain();
//In reality, 'address1' and 'address2' would be the public key of someone's wallet
//In this example, we are sending 100 from 'address1' to 'address2'
//and we are sending 50 from 'address2' to 'address1'
//They both are sent to the pendingTransactions array
alanCoin.createTransaction(new Transaction('address1', 'address2', 100));
alanCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner.');
/*
	minePendingTransactions() mines the pendingTransactions Array before added them to the
	Blockchain. 'Alan-address' is the String associated with the 100 coin reward.
*/
alanCoin.minePendingTransactions('Alan-address');
//We are printing the balance figure of the value associated with 'Alan-address'
console.log('\n Balance of Alan is', alanCoin.getBalanceOfAddress('Alan-address'));



console.log('\n Starting the miner again...');
alanCoin.minePendingTransactions('Alan-address');
console.log('\n Balance of Alan is', alanCoin.getBalanceOfAddress('Alan-address'));


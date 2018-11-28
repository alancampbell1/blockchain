/*
	Private key is: e4f1b356a87e508e0366f2cd4ccf6f0c4dd103c6bbc50fa7a072c79bca5f9730
	Public key is: 040762a6d1c813f3b3fc7b98e905fff25be9e27004b4e2f5eb19d21bdf6a27f1d4affbca9eb3f5173f70675a639d95e291d7505ed578baa2c1b95234597b1e64df
*/

//importing the blockchain and transaction objects
const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('e4f1b356a87e508e0366f2cd4ccf6f0c4dd103c6bbc50fa7a072c79bca5f9730');
const myWalletAddress = myKey.getPublic('hex');

let alanCoin = new Blockchain();

//first transaction, from my wallet to another public key and I want to send 10 coins
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
//sign transaction with my private key
tx1.signTransaction(myKey);
//add transaction to the pendingTransactions array
alanCoin.addTransaction(tx1);

console.log('\n Starting the miner.');
alanCoin.minePendingTransactions(myWalletAddress);
console.log('\n Balance of Alan is', alanCoin.getBalanceOfAddress(myWalletAddress));

//Changing a value of amount in the transactions object in the second block of the Blockchain
alanCoin.chain[1].transactions[0].amount = 1;
//Printing the value to the screen
console.log('Is chain valid: ' + alanCoin.isChainValid());
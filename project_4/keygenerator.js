/*
	This file will generate our private and public keys. This will allow us to
	create a wallet.
	The keys will allow us to sign transactions and verify our balance.
*/

/*
	This imported library/dependency will us to generate a public and private
	key. It also has methods to sign something and verify a signature.
*/
const EC = require('elliptic').ec;
//secp256k1 is the algorithm of Bitcoin Wallets
const ec = new EC('secp256k1');

//generate a key pair
const key = ec.genKeyPair();
//extract the public and private keys
const publicKey = key.getPublic('hex');
const privatekey = key.getPrivate('hex');

console.log();
console.log('Private key is: ', privatekey);
console.log();
console.log('Public key is: ', publicKey);
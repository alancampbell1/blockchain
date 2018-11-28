About Blockchain:

A blockchain is a chain of blocks that contains information.
It was first designed in 1991 for timestamp data to stop backdating and the editing of data. However, it did not take off until 2009 when it was used to develop the Cryptocurrency 'Bitcoin'.

A blockchain is a distributed ledger that is completely open to everyone. Once some data has been recorded inside a blockchain, it becomes very difficult to chain it.
This inability to change a blockchain comes from what is stored in each block.
This includes:
Data - this depends on the type of blockchain. For example, Bitcoin stores data on the transaction, such as the sender, receiver and the amount of coins.
Hash - a unique identifier to identify that block in the chain. If something is changed inside a block, the hash changes too. This makes it easy to identify if someone has made a change as the block is not longer the same block it was before.
Hash of the previous block - used to identify what block came before it. This creates the chain and makes it secure.

In a Blockchain, the first block is called the Genesis block. For this block, its previous hash value is generally something like '0000'.

However, using hashes in Blockchains are not powerful enough to stop people from making changes. Computers are so powerful today that they can change a block's internal data and then re-calculate all the hash values following it that will change before anyone will notice. 
To stop this, blockchains use a process called 'Proof of Work'. It's a mechanism that slows down the creation of new blocks. For Bitcoin, it's about 10mins to calculate the required 'Proof of Work' and add a new block to the chain. This makes it very hard to tamper with their blocks. Tampering with one block cause you to recalculate the 'Proof of Work' for all the other blocks. 
The security of a blockchain comes from its hashing and 'Proof of Work' mechanism. 

The final way Blockchain makes itself secure is by being distributed. Instead of having a central location of the chain, Blockchain uses a Peer to Peer Network, aka P2P Network. This allows everyone to join. When someone joins, they get a full copy of the blockchain. The node can use this to verify that everything is still in order.
When someone creates a new block, that block is sent to everyone on the network. Each node then verifies the block to make sure it has not been tampered with. If everything is ok, each node adds this to their blockchain. All the nodes in this case create consensus. They agree about what blocks are valid and which are not. Blocks that have been tampered with are rejected by other nodes. 

To successfully tamper with a block, you must tamper with all the blocks on the chain, re-do the proof of work for each block and take control of more than 50% of the P2P network. Thus making it almost impossible. 

Blockchains are also constantly evolving. A recent creation is that of 'Smart Contracts'. These contracts are simple programs that are stored on the blockchain and can be used to automatically exchange coins based on certain conditions. 

Blockchain technology can be used for a variety of things including: storing medical records, creating a digital notary and collecting taxes. 


What are Smart Contracts:
Smart Contracts are like normal contracts in the real world but are completely digital. A smart contract is actually a small computer program that is stored entirely inside a Blockchain. 

An example of the use of Smart Contracts is with 'Kickstarter'. 'Kickstarter' acts as a middleman between a product team looking for funding and their supports/patrons looking to give them money. 'Kickstarter' would use a Smart Contract to store all the money from the supporters until the product team's financial goal is met. If it is not, then the money is sent back to the supporters. 

We can trust Smart Contracts because they are stored on a Blockchain and hence inherit some common attributes including:
Immutable - unable to change
Distributed - using the P2P network

Other uses of Smart Contracts include: Banks using it to offer loans and carry out automatic payments, Insurance companies can use it to process claims and Postal services can use it on Payment on Delivery.

The biggest blockchain that supports Smart Contracts is Ethereum. This is a Blockchain built specifically to deal with Smart Contracts. They can be processed in a special programming language called Solidity, created for Ethereum and uses a syntax similar to JavaScript. Bitcoin also supports Smart Contracts but is more limited that Ethereum.

To run the following Blockchain examples install node.js and the following dependencies:

npm install --save crypto-js


'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  // Enter your solution here
  if (transaction.amount < 0) {
    return false;
  }

  let data = transaction.source + transaction.recipient + transaction.amount;

  return signing.verify(transaction.source, data, transaction.signature);

};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  // Your code here
  for (let tx of block.transactions) {
    if (isValidTransaction(tx) === false) {
      return false;
    }
  }

  const transactionString = block.transactions.map(t => t.signature).join('');
    const data = block.previousHash + transactionString + block.nonce;

  if (block.hash !== createHash('sha512').update(data).digest('hex')) {
    return false;
  }

  return true;

};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  // Your code here

  // console.log(blockchain);
  if (blockchain.blocks[0].previousHash !== null) {
    return false;
  }

  for (let i = 1; i < blockchain.blocks.length; i++) {
    let current = blockchain.blocks[i];
    if (!isValidBlock(current)) {
      return false;
    }
    if (current.previousHash !== blockchain.blocks[i - 1].hash) {
      return false;
    }
    for (let tx of current.transactions) {
      if (!isValidTransaction(tx)) {
        return false;
      }
    }
  }

  return true;

};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here
  // console.log(blockchain);
  blockchain.blocks[1].transactions[0].recipient = 'Derek';
  return blockchain;

};

module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};

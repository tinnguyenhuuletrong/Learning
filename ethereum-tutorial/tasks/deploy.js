const fs = require('fs');
const Web3 = require('web3');
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let VotingContractInfo = require('../bin/src/Voting.json')
let VotingContract = web3.eth.contract(JSON.parse(VotingContractInfo.abi));
let byteCode = VotingContractInfo.bytecode

let deployedContract = VotingContract.new(['A', 'B', 'C'],
    { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 },
    (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        // Log the tx, you can explore status with eth.getTransaction()
        console.log(res.transactionHash);

        // If we have an address property, the contract was deployed
        if (res.address) {
            console.log('Contract address: ' + res.address);
            test(res.address);
        }
    });

function test(address) {
    let contractInstance = VotingContract.at(deployedContract.address);

    console.log("Vote A", contractInstance.voteForCandidate('A', {from: web3.eth.accounts[0]}))
    console.log("Vote A", contractInstance.voteForCandidate('A', {from: web3.eth.accounts[0]}))
    console.log("Vote A", contractInstance.voteForCandidate('A', {from: web3.eth.accounts[0]}))

    console.log(contractInstance.totalVotesFor.call('A').toString());
}
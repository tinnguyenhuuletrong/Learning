const { TransactionFactory } = require("@ethereumjs/tx");
const Web3 = require("web3");
const web3 = new Web3();

/*
pragma solidity ^0.4.21;

contract PublicKeyChallenge {
    address owner = 0x92b28647ae1f3264661f72fb2eb9625a89d88a31;
    bool public isComplete;

    function authenticate(bytes publicKey) public {
        require(address(keccak256(publicKey)) == owner);

        isComplete = true;
    }
}
*/

// Get Txraw data from etherscan
//  Click on Tx ( sign by address )
//    Example https://ropsten.etherscan.io/tx/0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb
// Click on : button (top right) -> rawTx

const tx = TransactionFactory.fromSerializedData(
  Buffer.from(
    "f87080843b9aca0083015f90946b477781b0e68031109f21887e6b5afeaaeb002b808c5468616e6b732c206d616e2129a0a5522718c0f95dde27f0827f55de836342ceda594d20458523dd71a539d52ad7a05710e64311d481764b5ae8ca691b05d14054782c7d489f3511a7abf2f5078962",
    "hex"
  )
);

console.log(tx);
console.log("pubKey", tx.getSenderPublicKey().toString("hex"));
console.log("signedByAddress", tx.getSenderAddress().toString("hex"));

//address is the last 20 bytes of the keccak-256 hash of the address’s public key.
console.log(web3.utils.sha3(tx.getSenderPublicKey()));
//  -> last 20 bytes === address

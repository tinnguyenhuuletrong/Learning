/*
contract CaptureTheEther {
  mapping (address => bytes32) public nicknameOf;

  function setNickname(bytes32 nickname) public {
      nicknameOf[msg.sender] = nickname;
  }
}

Leason learned
 - can use remix to generate abi from src
*/

var CaptureTheEther_abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "nicknameOf",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "nickname",
        type: "bytes32",
      },
    ],
    name: "setNickname",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// string -> bytes32
name = web3.utils.fromAscii("TinTaToi");

cteContract = new web3.eth.Contract(
  CaptureTheEther_abi,
  "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee"
);
cteContract.methods
  .setNickname(name)
  .send({ from: "0xc0eb8D91d3a87720bEFA1112B1279863c4ceF520" });

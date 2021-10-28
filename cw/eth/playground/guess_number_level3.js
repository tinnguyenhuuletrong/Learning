const fs = require("fs");
const INFURA_WS = fs.readFileSync("./.env").toString();
const PRIV_KEY = fs.readFileSync("./.privkey.env").toString();

const Web3 = require("web3");
const web3 = new Web3(INFURA_WS);
let account;

async function main() {
  loadAccount();
  await test();
  process.exit(0);
}
main();

async function loadAccount() {
  account = web3.eth.accounts.privateKeyToAccount(PRIV_KEY);
  web3.eth.accounts.wallet.add(PRIV_KEY);
  web3.eth.Contract.defaultAccount = account.address;
}

async function findAnswer() {
  // https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#id57
  const [pendingBlock, latestBlockMinus1] = await Promise.all([
    web3.eth.getBlock("pending"),
    web3.eth.getBlock("latest"),
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

async function test() {
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "guess",
          type: "uint8",
        },
        {
          indexed: false,
          name: "answer",
          type: "uint8",
        },
      ],
      name: "Log",
      type: "event",
    },
  ];

  const ctx = new web3.eth.Contract(
    abi,
    "0x244CD9c888C03C26c41f58C851d53cEff47d224E"
  );

  const answer2 = await findAnswer2();
  const answer = await findAnswer();
  console.log({ answer, answer2 });

  const res = await ctx.methods.guess(answer).send({
    from: account.address,
    value: web3.utils.toWei("0.000001", "ether"),
    gasLimit: 21204 * 2,
    // gasPrice: web3.utils.toWei("0.0001", "ether"),
  });
  console.log(res);
}

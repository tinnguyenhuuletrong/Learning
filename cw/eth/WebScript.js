/*
  Load web3
  link with metamask
*/

await import(
  "https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.1-rc.0/web3.min.js"
);
window.web3 = new Web3(window.ethereum);

const accounts = await window.ethereum.enable();
web3.eth.Contract.defaultAccount = accounts[0];

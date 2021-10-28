// https://medium.com/coinmonks/smart-contract-exploits-part-2-featuring-capture-the-ether-math-31a289da0427
// Learn from medium. I was lacking of knowleage about this

/*
pragma solidity ^0.4.21;

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address _player) public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }
    
    function checkBalance() public view returns (uint256) {
        return address(this).balance ;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
    
    function testOverflow(uint256 numTokens) pure returns (uint256) {
        return numTokens * PRICE_PER_TOKEN;
    }
}
*/

/*
 uint256 -> maxValue = 2n**256n - 1
 1ether = 1n ** 18n

 X * 1.18..0 should > max => remainer count from 0

 X = maxValue / 1ether + x // +X make the mul overflow again

 we pick +1 => lowest price
 => 115792089237316195423570985008687907853269984665640564039458
  => 415992086870360064 == 0.4 ether
*/

/*
  Attack: 
    buy 115792089237316195423570985008687907853269984665640564039458 only 0.4 eth
    sell 1 => contract loss 0.6 => remaining 0.4
*/

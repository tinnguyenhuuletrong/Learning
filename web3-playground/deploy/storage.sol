pragma solidity ^0.4.23;

contract Storage {
    uint pos0;
    mapping(address => uint) pos1;
    
    constructor() public{
        pos0 = 1234;
        pos1[msg.sender] = 5678;
    }
    
    function setVal(uint val) public {
        pos0 = val;
    }
    
    function setMapVal(uint val) public {
        pos1[msg.sender] = val;
    }
    
    function getPos0() view public returns(uint) {
        return pos0;
    }
    
    function getPos1() view public returns(uint) {
        return pos1[msg.sender];
    }
    
}

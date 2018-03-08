pragma solidity ^0.4.13;

contract Kata {
    struct Item {
        string key;
        uint val;
        uint size;
    }
    Item[] public LookupTable;

    function() public {
        LookupTable.push(Item("M", 1000, 1));
        LookupTable.push(Item("CM", 900, 2));
        LookupTable.push(Item("D", 500, 1));
        LookupTable.push(Item("CD", 400, 2));
        LookupTable.push(Item("C", 100, 1));
        LookupTable.push(Item("XC", 90, 2));
        LookupTable.push(Item("L", 50, 1));
        LookupTable.push(Item("XL", 40, 2));
        LookupTable.push(Item("X", 10, 1));
        LookupTable.push(Item("IX", 9, 2));
        LookupTable.push(Item("V", 9, 1));
        LookupTable.push(Item("IV", 4, 2));
        LookupTable.push(Item("I", 1, 1));
    }

    function solution(uint n) public returns (string) {
        // Convert the positive integer to a Roman Numeral
    }
}
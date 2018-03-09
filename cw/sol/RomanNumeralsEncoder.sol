pragma solidity ^0.4.13;

contract Kata {
   
    string[] RomanCharaters = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    uint[] RomanValue = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

    function solution(uint n) public returns (string) {
        uint resultIndex = 0;
        uint val = n;
        uint i;
        uint j;
        uint romanValue;
        bytes memory results = new bytes(32);
        for ( i = 0; i < RomanCharaters.length; i++) {
            romanValue = RomanValue[i];
            bytes memory _tmpVal = bytes(RomanCharaters[i]);
            while (val >= romanValue) {
                for ( j = 0; j < _tmpVal.length; j++) {
                    results[resultIndex++] = _tmpVal[j];
                }
                val -= romanValue;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(resultIndex);
        for (j = 0; j < resultIndex; j++) {
            bytesStringTrimmed[j] = results[j];
        }
        return string(bytesStringTrimmed);
    }
}
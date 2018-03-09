pragma solidity ^0.4.13;

contract Kata {
    string[] SYMBOLS = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    uint[] VALUES = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

    function solution(uint n) public returns (string) {
        string memory result = "";
        uint val = n;
        uint i;
        for ( i = 0; i < 13; i++) {
            uint tmpVal = VALUES[i];
            while (val >= tmpVal) {
                result = concat(result, SYMBOLS[i]);
                val -= tmpVal;
            }
        }
        return result;
    }

    function concat(string _base, string _value) internal returns (string) {
        bytes memory _baseBytes = bytes(_base);
        bytes memory _valueBytes = bytes(_value);

        string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
        bytes memory _newValue = bytes(_tmpValue);

        uint i;
        uint j;

        for ( i = 0; i < _baseBytes.length; i++) {
            _newValue[j++] = _baseBytes[i];
        }

        for ( i = 0; i < _valueBytes.length; i++) {
            _newValue[j++] = _valueBytes[i];
        }

        return string(_newValue);
    }
}
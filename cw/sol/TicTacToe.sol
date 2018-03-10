pragma solidity ^0.4.13;

//  0 if a spot is empty, 
//  1 if it is an "X"
//  2 if it is an "O"

// -1 if the board is not yet finished (there are empty spots),
// 1 if "X" won,
// 2 if "O" won,
// 0 if it's a cat's game (i.e. a draw).

contract TicTacToe {
    uint8[] MASK = [0,0,0,1,0,2,0,0,1,0,2,0,0,2,1,2,2,2,2,0,2,1,2,2,0,0,1,1,2,2,0,2,1,1,2,0,0,1,1,1,2,1,1,0,1,1,1,2];
    function isSolved(int[3][] board) returns (int) {
        // TODO: Check if the board is solved
        uint8 i;
        int a;
        int b;
        int c;
        uint len = MASK.length;
        uint8 hasEmpty = 0;
        while (i < len) {
            a = board[MASK[i++]][MASK[i++]];
            b = board[MASK[i++]][MASK[i++]];
            c = board[MASK[i++]][MASK[i++]];

            if (a==1 && b==1 && c==1) 
                return 1;
            else if (a==2 && b==2 && c==2) 
                return 2;
            
            if (a*b*c == 0)
                hasEmpty = 1;
        }
        
        if (hasEmpty == 1)
            return -1;
        return 0;
    }
}
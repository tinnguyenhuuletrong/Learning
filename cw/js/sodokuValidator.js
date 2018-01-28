//http://www.codewars.com/kata/529bf0e9bdf7657179000008/train/javascript
const SIZE = 9

function isComplete(arr) {
    return arr.filter(itm => itm != null).length == SIZE;
}

function isSolve(puzzle) {
    // row, column check
    for (var i = 0; i < SIZE; i++) {
        const tmpRow = Array(SIZE)
        const tmpCol = Array(SIZE)

        for (var j = 0; j < SIZE; j++) {
            const valRow = puzzle[i][j]
            if (valRow == 0)
                return false
            if (tmpRow[valRow] == 1)
                return false
            tmpRow[valRow] = 1

            const valCol = puzzle[j][i]
            if (valCol == 0)
                return false
            if (tmpCol[valCol] == 1)
                return false
            tmpCol[valCol] = 1
        }

        if (!isComplete(tmpRow) || !isComplete(tmpCol))
            return false;
    }

    // Region check
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (!regionCheck(puzzle, i, j))
                return false
        }
    }

    return true
}

function regionCheck(puzzle, regX, regY) {
    const tmp = Array(SIZE)
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            const tmpX = regX * 3 + i
            const tmpY = regY * 3 + j
            const val = puzzle[tmpX][tmpY]
            if (val == 0)
                return false
            if (tmp[val] == 1)
                return false
            tmp[val] = 1
        }
    }
    return true
}

function validSolution(board) {
    return isSolve(board)
}


const testCase = [[5, 3, 4, 6, 7, 8, 9, 1, 2], 
[6, 7, 2, 1, 9, 5, 3, 4, 8],
[1, 9, 8, 3, 4, 2, 5, 6, 7],
[8, 5, 9, 7, 6, 1, 4, 2, 3],
[4, 2, 6, 8, 5, 3, 7, 9, 1],
[7, 1, 3, 9, 2, 4, 8, 5, 6],
[9, 6, 1, 5, 3, 7, 2, 8, 4],
[2, 8, 7, 4, 1, 9, 6, 3, 5],
[3, 4, 5, 2, 8, 6, 1, 7, 9]]

console.log(validSolution(testCase));
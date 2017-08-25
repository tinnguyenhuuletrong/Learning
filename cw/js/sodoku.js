const SIZE = 9
const VALUES = Array.apply(null, {length: 9}).map((i,j) => j + 1)
function sudoku(puzzle) {
	//return the solved puzzle as a 2d array of 9 x 9 
	solved(puzzle)
	return puzzle
}

function solve(puzzle) {
	if(isSolve(puzzle))
		return
	
	for (var i = 0; i < SIZE; i++) {
		for (var j = 0; j < SIZE; j++) {
			if(puzzle[i][j] != 0) continue

			// trying to test value
			const vals = valueCanTry(puzzle, i, j)
			
			// can't find value can fill ?  -> wrong way
			if(vals.length == 0)
				return
			
			for (var k = 0; k < vals.length; k++) {
				puzzle[i][j] = vals[k]
				
				solve(puzzle)
				if(isSolve(puzzle))
					return
				
				puzzle[i][j] = 0
			}

			// try all available value but can't fill ? -> wrong wray
			return
		}
	}
}

function valueCanTry(puzzle, x, y) {
	const tmp = new Set(VALUES)
	for (var i = 0; i < SIZE; i++) {
		const valX = puzzle[x][i]
		const valY = puzzle[i][y]
		tmp.delete(valX)
		tmp.delete(valY)
	}

	// region check
	const regX = Math.floor(x /3)
	const regY = Math.floor(y /3)
	// console.log(regX, regY)
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			const tmpX = regX * 3 + i
			const tmpY = regY * 3 + j
			tmp.delete(puzzle[tmpX][tmpY])
		}
	}

	return Array.from(tmp)
}

function isSolve(puzzle) {
	// row, column check
	for (var i = 0; i < SIZE; i++) {
		const tmp = Array(SIZE)
		for (var j = 0; j < SIZE; j++) {
			const val = puzzle[i][j]
			if(val == 0)
				return false
			if(tmp[val] == 1)
				return false
			tmp[val] = 1
		}
	}

	// Region check
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if(!regionCheck(puzzle, i, j))
				return false
		}
	}

	return true
}

function regionCheck(puzzle, regX, regY) {
	for (var i = 0; i < 3; i++) {
		const tmp = Array(SIZE)
		for (var j = 0; j < 3; j++) {
			const tmpX = regX * 3 + i
			const tmpY = regY * 3 + j
			const val = puzzle[tmpX][tmpY]
			if(val == 0)
				return false
			if(tmp[val] == 1)
				return false
			tmp[val] = 1
		}
	}
	return true
}

//-------------------------
var puzzle = [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9]]

var solution = [ 
  [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]]

// var tmp = 
// [ [ 5, 3, 6, 2, 7, 8, 1, 0, 0 ],
//   [ 6, 0, 0, 1, 9, 5, 0, 0, 0 ],
//   [ 0, 9, 8, 0, 0, 0, 0, 6, 0 ],
//   [ 8, 0, 0, 0, 6, 0, 0, 0, 3 ],
//   [ 4, 0, 0, 8, 0, 3, 0, 0, 1 ],
//   [ 7, 0, 0, 0, 2, 0, 0, 0, 6 ],
//   [ 0, 6, 0, 0, 0, 0, 2, 8, 0 ],
//   [ 0, 0, 0, 4, 1, 9, 0, 0, 5 ],
//   [ 0, 0, 0, 0, 8, 0, 0, 7, 9 ] ]
// console.log(isSolve(puzzle))
solve(puzzle)
console.log(puzzle)
//http://www.codewars.com/kata/challenge-fun-number-10-integer-square-root/train/javascript

// "Prime Numbers: A Computational Perspective"
//https://stackoverflow.com/questions/1623375/writing-your-own-square-root-function
/*
    x = 2^ceil(numbits(N)/2)
    loop:
        y = floor((x + floor(N/x))/2)
        if y >= x
            return x
        x = y
*/

// Newton–Raphson method
// F(x) = x^2 - N
// F'(x) = 2 * x
// https://en.wikipedia.org/wiki/Newton%27s_method#Square_root_of_a_number

function integerSquareRoot(Number) {
	//coding and coding..
}

//------------------------------------------------------------------//
// Test
//------------------------------------------------------------------//
function test(input, answer) {
    const res = integerSquareRoot(input);
    console.log(`${input} -> ${res} : ${answer}`);
}


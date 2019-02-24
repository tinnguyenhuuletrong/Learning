//https://www.codewars.com/kata/55084d3898b323f0aa000546/train/go
package kata

import (
	"bytes"
	"fmt"
	"math"
	"strings"
	"testing"
	"unicode"
)

func shiftRightAndClaim(val, shift, A, B rune) rune {
	var tmp = val - A + shift
	tmp %= (B - A + 1)
	return A + tmp
}

func shiftLeftAndClaim(val, shift, A, B rune) rune {
	return shiftRightAndClaim(val, shift+(B-A+1), A, B)
}

func Encode(s string, shift int) []string {
	var buffer bytes.Buffer

	var firstChar = unicode.ToLower(rune(s[0]))
	buffer.WriteRune(firstChar)

	var shiftChar = shiftRightAndClaim(firstChar, rune(shift), 'a', 'z')
	buffer.WriteRune(shiftChar)

	for _, val := range s {
		if val >= 'a' && val <= 'z' {
			buffer.WriteRune(shiftRightAndClaim(val, rune(shift), 'a', 'z'))
		} else if val >= 'A' && val <= 'Z' {
			buffer.WriteRune(shiftRightAndClaim(val, rune(shift), 'A', 'Z'))
		} else {
			buffer.WriteRune(rune(val))
		}
	}
	var encoded = []rune(buffer.String())
	var encodedLen = len(encoded)
	var chunkLen = int(math.Ceil(float64(encodedLen) / 5))

	var res []string
	for i := 0; i < 5; i++ {
		var begin = i * chunkLen
		var end = int(math.Min(float64(i*chunkLen+chunkLen), float64(encodedLen)))
		if end > begin {
			res = append(res, string(encoded[begin:end]))
		}
	}

	return res
}

func Decode(arr []string) string {
	var buffer bytes.Buffer
	var firstChar = rune(arr[0][0])
	var secondChar = rune(arr[0][1])
	var shift = secondChar - firstChar

	arr[0] = arr[0][2:len(arr[0])]

	var encodedString = strings.Join(arr, "")
	for _, val := range encodedString {
		if val >= 'a' && val <= 'z' {
			buffer.WriteRune(shiftLeftAndClaim(val, -shift, 'a', 'z'))
		} else if val >= 'A' && val <= 'Z' {
			buffer.WriteRune(shiftLeftAndClaim(val, -shift, 'A', 'Z'))
		} else {
			buffer.WriteRune(rune(val))
		}
	}
	return buffer.String()
}

func TestEncode(t *testing.T) {
	// var res = Encode(`I should have known that you would have a perfect answer for me!!!`, 1)
	// for _, val := range res {
	// 	fmt.Println(val)
	// }
	// fmt.Println("Decode: ", Decode(res))

	// var res = Encode(`I can reset`, 16)
	// for _, val := range res {
	// 	fmt.Println(val)
	// }
	// fmt.Println("Decode: ", Decode(res))

	var res = Encode(`bit-set bit-shift-right bit-shift-left bit-and-not bit-clear`, 18)
	for _, val := range res {
		fmt.Println(val)
	}
	fmt.Println("Decode: ", Decode(res))
	// fmt.Printf("%v\n", string(shiftRightAndClaim('i', 27, 'a', 'z')))
}

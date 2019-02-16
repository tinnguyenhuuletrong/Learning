// https://www.codewars.com/kata/is-my-friend-cheating/train/go
package kata

import (
	"fmt"
	"testing"
)

func RemovNb(m uint64) [][2]uint64 {
	var S = (m + 1) * m / 2
	var res [][2]uint64
	for i := uint64(m / 2); i <= m-1; i++ {
		var j = (S - i) / (i + 1)
		if i*j == S-i-j {
			res = append(res, [2]uint64{i, j})
		}
	}
	return res
}

// go test -run TestSumEvenFibonacci
func TestRemoveNb(t *testing.T) {
	// [][2]uint64{{15, 21}, {21, 15}}
	fmt.Println(RemovNb(1000000003))
}

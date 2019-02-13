// https://www.codewars.com/kata/how-much/train/go
package kata

import (
	"fmt"
	"testing"
)

func HowMuch(m int, n int) [][3]string {
	var begin, end = m, n
	if m > n {
		begin, end = n, m
	}
	var res [][3]string
	for i := begin; i <= end; i++ {
		var tmp1 = i % 7
		var tmp2 = i % 9
		if tmp1 == 2 && tmp2 == 1 {
			res = append(res, [3]string{fmt.Sprintf("M %d", i), fmt.Sprintf("B %d", int(i/7)), fmt.Sprintf("C %d", int(i/9))})
		}
	}
	return res
}

// go test -run TestSumEvenFibonacci
func TestGranny(t *testing.T) {
	var res = HowMuch(1, 100)
	//[][3]string{{"M: 37", "B: 5", "C: 4"}, {"M: 100", "B: 14", "C: 11"}}
	fmt.Println(res)
}

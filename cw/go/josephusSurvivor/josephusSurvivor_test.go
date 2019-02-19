// https://www.codewars.com/kata/josephus-survivor/train/go
package kata

import (
	"fmt"
	"testing"
)

func JosephusSurvivor(n, k int) int {
	var A = make([]int, n)
	for i := range A {
		A[i] = i + 1
	}

	var i = 0
	for len(A) != 1 {
		i += k - 1
		i = i % len(A)
		A = append(A[:i], A[i+1:]...)
	}
	return A[0]
}

func TestJosephusSurvivor(t *testing.T) {
	fmt.Println(JosephusSurvivor(7, 3))   // -> 4
	fmt.Println(JosephusSurvivor(100, 1)) // -> 4
}

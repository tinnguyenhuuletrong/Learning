package kata

import (
	"fmt"
	"testing"
)

func FindUniq(arr []float32) float32 {
	len := len(arr)
	for index := 0; index <= len-3; index++ {
		var a, b, c = arr[index], arr[index+1], arr[index+2]

		if a != b && a != c {
			return a
		} else if b != a && b != c {
			return b
		} else if c != a && c != b {
			return c
		}
	}
	return arr[0]
}

// go test -run TestSumEvenFibonacci
func TestFindUniq(t *testing.T) {
	case1 := []float32{1.0, 1.0, 1.0, 2.0, 1.0, 1.0}
	fmt.Println(FindUniq(case1))
}

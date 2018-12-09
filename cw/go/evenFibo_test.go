package kata

import (
	"fmt"
	"testing"
)

var Cache = make(map[int]int)

func Fibo(n int) int {
	// Cache lookup
	if val, ok := Cache[n]; ok {
		return val
	}

	if n == 1 {
		return 1
	} else if n == 2 {
		return 2
	}
	res := Fibo(n-1) + Fibo(n-2)
	Cache[n] = res
	return res
}

func SumEvenFibonacci(limit int) int {
	index := 3
	sum := 2
	lastVal := 2

	for lastVal < limit {
		lastVal = Fibo(index)
		index++
		if lastVal%2 == 0 {
			sum += lastVal
		}
	}
	return sum
}

// go test -run TestSumEvenFibonacci
func TestSumEvenFibonacci(t *testing.T) {
	case1 := 8
	fmt.Println(SumEvenFibonacci(case1))
}

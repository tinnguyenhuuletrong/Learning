// https://www.codewars.com/kata/k-primes/train/go
package kata

import (
	"fmt"
	"testing"
)

var CacheKPrime = make(map[int]int)

func primeFactorCount(n int) int {
	if val, ok := CacheKPrime[n]; ok {
		return val
	}

	var count, tmp = 0, n

	for i := 2; tmp != 1; i++ {
		if tmp%i == 0 {
			tmp /= i
			count++
			i--
		}
	}

	CacheKPrime[n] = count
	return count
}

func CountKprimes(k, start, nd int) []int {
	var res []int

	for i := start; i <= nd; i++ {
		var count = primeFactorCount(i)
		if count == k {
			res = append(res, i)
		}
	}
	return res
}

func Puzzle(s int) int {
	var count = 0
	var Set1, Set3, Set7 []int

	for i := 2; i <= s; i++ {
		var count = primeFactorCount(i)
		if count == 1 {
			Set1 = append(Set1, i)
		} else if count == 3 {
			Set3 = append(Set3, i)
		} else if count == 7 {
			Set7 = append(Set7, i)
		}
	}

	for i := 0; i < len(Set7); i++ {
		var remain1 = s - Set7[i]
		for j := 0; Set3[j] <= remain1; j++ {
			var remain2 = remain1 - Set3[j]
			for k := 0; Set1[k] <= remain2; k++ {
				if remain2 == Set1[k] {
					println(Set7[i], Set3[j], Set1[k], "->", Set7[i]+Set3[j]+Set1[k])

					count++
				}
			}
		}
	}
	return count
}

// go test -run TestSumEvenFibonacci
func TestKprime(t *testing.T) {
	// var k, start, nd = 5, 1000, 1100
	//[]int{1020, 1026, 1032, 1044, 1050, 1053, 1064,   1072, 1092, 1100}
	// fmt.Println("1", CountKprimes(5, 1000, 1100))
	// fmt.Println("2", CountKprimes(5, 500, 600))
	// fmt.Println("3", CountKprimes(7, 1000, 1500))
	// fmt.Println("4", CountKprimes(7, 10000, 10100))
	// fmt.Println("5", CountKprimes(7, 100000, 100100))
	// fmt.Println("6", CountKprimes(12, 100000, 100100))
	// fmt.Println("7", CountKprimes(1, 2, 30))
	fmt.Println("8", CountKprimes(8, 10000000, 10000200))
	fmt.Println(Puzzle(171))
}

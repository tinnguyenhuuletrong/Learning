// https://www.codewars.com/kata/k-primes/train/go
package kata

import (
	"fmt"
	"testing"
)

var CachePrime = make(map[int]bool)
var CacheKPrime = make(map[int]int)

func isPrime(n int) bool {
	if val, ok := CachePrime[n]; ok {
		return val
	}
	var res = true
	if n == 2 || n == 3 {
		res = true
	} else if n%2 == 0 || n%3 == 0 {
		res = false
	} else {
		var i = 5
		var w = 2

		for i*i <= n {
			if n%i == 0 {
				res = false
				break
			}

			i += w
			w = 6 - w
		}

	}

	CachePrime[n] = res
	return res
}

func nextPrimeLessThan(start, end int) int {
	for i := start; i < end; i++ {
		if isPrime(i) {
			return i
		}
	}
	return -1
}

func primeFactorCount(n int) int {
	if val, ok := CacheKPrime[n]; ok {
		return val
	}
	var start, tmp, count = 2, n, 0

	if isPrime(n) {
		count = 1
		tmp = 1
	}

	for tmp != 1 {
		if tmp%start == 0 {
			count++
			tmp /= start
			if val, ok := CacheKPrime[tmp]; ok {
				count += val
				break
			}
		} else {
			start = nextPrimeLessThan(start+1, tmp)
			if start == -1 {
				count++
				break
			}
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

	for i := 1; i <= s; i++ {
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
		for j := 0; j < len(Set3) && Set3[j] <= remain1; j++ {
			var remain2 = remain1 - Set3[j]
			for k := 0; k < len(Set1) && Set1[k] <= remain2; k++ {
				if remain2 == Set1[k] {
					count++
				}
			}
		}
	}
	return count
}

// go test -run TestSumEvenFibonacci
func TestKprime(t *testing.T) {
	var k, start, nd = 5, 1000, 1100
	//[]int{1020, 1026, 1032, 1044, 1050, 1053, 1064,   1072, 1092, 1100}
	fmt.Println(CountKprimes(k, start, nd))
	fmt.Println(Puzzle(138))
}

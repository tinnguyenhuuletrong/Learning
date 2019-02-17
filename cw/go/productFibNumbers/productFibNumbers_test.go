// https://www.codewars.com/kata/product-of-consecutive-fib-numbers/train/go
package kata

import (
	"fmt"
	"math"
	"math/big"
	"testing"
)

var SQRT5 = math.Sqrt(5)
var PHI = (1 + SQRT5) / 2

var CACHE = map[uint64]uint64{0: 0, 1: 1}

func Fn(n uint64) uint64 {
	if val, ok := CACHE[n]; ok {
		return val
	}
	var val = Fn(n-1) + Fn(n-2)
	CACHE[n] = val
	return val
}

func UpperBound(n uint64) uint64 {
	var tmp = float64(n) * SQRT5
	return uint64(math.Log(tmp) / math.Log(PHI))
}

func bigMulAndCompare(prod, a, b uint64) int {
	var ba, bb, pb, tmp big.Int
	ba.SetUint64(a)
	bb.SetUint64(b)
	pb.SetUint64(prod)
	tmp.Mul(&ba, &bb)
	return pb.Cmp(&tmp)
}

func ProductFib(prod uint64) [3]uint64 {
	var res [3]uint64
	var upper = UpperBound(prod)
	for upper > 1 {
		var a = Fn(upper - 1)
		var b = Fn(upper)
		var cmp = bigMulAndCompare(prod, a, b)
		upper--
		if cmp == 0 {
			res = [3]uint64{a, b, 1}
			break
		} else if cmp > 0 {
			res = [3]uint64{b, Fn(upper + 2), 0}
			break
		}
	}
	return res
}
func TestProductFib(t *testing.T) {
	fmt.Println(ProductFib(714))
	fmt.Println(ProductFib(800))
	fmt.Println(ProductFib(2563195080744681828))
	fmt.Println(ProductFib(5456077604922913920))
}

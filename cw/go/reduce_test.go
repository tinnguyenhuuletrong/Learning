package kata

import (
	"fmt"
	"testing"
)

func Gcdi(x, y int) int {
	x, y = abs(x), abs(y)
	if x == y {
		return x
	} else if x == 0 {
		return y
	} else if y == 0 {
		return x
	} else {
		return Gcdi(y, x%y)
	}
}
func Som(x, y int) int {
	return x + y
}
func Maxi(x, y int) int {
	var c int
	if c = x; x < y {
		c = y
	}
	return c
}
func Mini(x, y int) int {
	var c int
	if c = x; x > y {
		c = y
	}
	return c
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func Lcmu(x, y int) int {
	return abs(x*y) / Gcdi(x, y)
}

type FParam func(int, int) int

func OperArray(f FParam, arr []int, init int) []int {
	var res []int
	tmp := f(init, arr[0])
	res = append(res, tmp)
	for i := 1; i < len(arr); i++ {
		tmp = f(tmp, arr[i])
		res = append(res, tmp)
	}
	return res
}

func TestReduce1(t *testing.T) {
	var dta = []int{18, 69, -90, -78, 65, 40}
	// var sol = []int{18, 3, 3, 3, 1, 1}
	fmt.Println(OperArray(Gcdi, dta, dta[0]))
}

func TestReduce2(t *testing.T) {
	var dta = []int{6, -72, -62, -22, -23, 80}
	// var sol = []int{6, 72, 2232, 24552, 564696, 5646960}
	fmt.Println(OperArray(Lcmu, dta, dta[0]))
}

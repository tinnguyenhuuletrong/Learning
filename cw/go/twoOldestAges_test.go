package kata

import (
	"fmt"
	"sort"
	"testing"
)

func TwoOldestAgesBest(ages []int) [2]int {
	a, b := 0, 0
	for _, v := range ages {
		if v > b {
			a, b = b, v
		} else if v > a {
			a = v
		}
	}
	return [2]int{a, b}
}

func TwoOldestAges(ages []int) [2]int {
	sort.Sort(sort.Reverse(sort.IntSlice(ages)))
	return [2]int{ages[1], ages[0]}
}

// go test -run TestTwoOldestAges
func TestTwoOldestAges(t *testing.T) {
	case1 := []int{1, 2, 4, 7, 19}
	fmt.Println(TwoOldestAges(case1))
	fmt.Println(TwoOldestAgesBest(case1))
}

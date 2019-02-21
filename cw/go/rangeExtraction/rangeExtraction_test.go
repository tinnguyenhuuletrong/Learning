// https://www.codewars.com/kata/range-extraction/train/go
package kata

import (
	"fmt"
	"strings"
	"testing"
)

func Solution(list []int) string {
	var res []string

	var doWrite = func(list []int, begin, end int) int {
		if end-begin < 2 {
			res = append(res, fmt.Sprintf("%v", list[begin]))
			return begin
		} else {
			res = append(res, fmt.Sprintf("%v-%v", list[begin], list[end]))
			return end
		}
	}

	var state = "LOOK"
	var begin = -1
	var runLength = 0
	for i := 0; i < len(list); i++ {
		switch state {
		case "LOOK":
			{
				begin = i
				runLength = -1
				state = "EXPAND"
			}
		case "EXPAND":
			{
				if runLength == -1 {
					runLength = list[i] - list[begin]
				} else if list[i]-list[i-1] != runLength {
					i = doWrite(list, begin, i-1)
					begin = -1
					state = "LOOK"
				}
			}
		}
	}

	var i = doWrite(list, begin, len(list)-1) + 1
	for ; i < len(list); i++ {
		res = append(res, fmt.Sprintf("%v", list[i]))
	}

	return strings.Join(res, ",")
}
func TestRangeExtract(t *testing.T) {
	// -> "-6,-3-1,3-5,7-11,14,15,17-20"
	fmt.Println(Solution([]int{-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20}))

	// -> "40,44,48,51,52,54,55,58,67,73"
	fmt.Println(Solution([]int{40, 44, 48, 51, 52, 54, 55, 58, 67, 73}))

	// -> "59-62,68-71,80-85,88,97"
	fmt.Println(Solution([]int{59, 60, 61, 62, 68, 69, 70, 71, 80, 81, 82, 83, 84, 85, 88, 97}))
}

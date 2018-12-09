package kata

import (
	"fmt"
	"testing"
)

func TwoSum(numbers []int, target int) [2]int {
	len := len(numbers)
	for i := 0; i < len-1; i++ {
		for j := i + 1; j < len; j++ {
			if numbers[i]+numbers[j] == target {
				return [2]int{i, j}
			}
		}
	}
	return [2]int{}
}

// go test -run TestTwoSum
func TestTwoSum(t *testing.T) {
	case1 := []int{1, 2, 3}
	fmt.Println(TwoSum(case1, 4))
}

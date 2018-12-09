package kata

import (
	"fmt"
	"testing"
)

func InAscOrder(numbers []int) bool {
	lastVal := numbers[0]
	for _, val := range numbers[1:] {
		if val < lastVal {
			return false
		}
		lastVal = val
	}
	return true
}

// go test -run TestInAscOrder
func TestInAscOrder(t *testing.T) {
	case1 := []int{1, 2, 4, 7, 19}
	fmt.Println(InAscOrder(case1))
}

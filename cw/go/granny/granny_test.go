// https://www.codewars.com/kata/help-your-granny/train/go
package kata

import (
	"fmt"
	"math"
	"testing"
)

func Distance(begin string, end string, h map[string]float64) float64 {
	var A, okA = h[begin]
	var B, okB = h[end]
	if okA && okB {
		return math.Sqrt(B*B - A*A)
	} else if okA {
		return A
	} else if okB {
		return B
	} else {
		return 0.0
	}
}

func Tour(arrFriends []string, ftwns map[string]string, h map[string]float64) int {
	var sum = 0.0
	var prev = "X0"
	for _, friend := range append(arrFriends, "X0") {
		var town, ok = ftwns[friend]
		if !ok {
			break
		}
		var d = Distance(prev, town, h)
		fmt.Println(prev, town, d)
		sum += d
		prev = town
	}
	return int(sum + h[prev])
}

// go test -run TestSumEvenFibonacci
func TestGranny(t *testing.T) {
	var friends1 = []string{"A1", "A2", "A3", "A4", "A5"}
	var fTowns1 = map[string]string{"A1": "X1", "A2": "X2", "A3": "X3", "A4": "X4"}
	var dist1 = map[string]float64{"X1": 100.0, "X2": 200.0, "X3": 250.0, "X4": 300.0}
	fmt.Println(Tour(friends1, fTowns1, dist1))

	friends1 = []string{"B1", "B2"}
	fTowns1 = map[string]string{"B1": "Y1", "B2": "Y2", "B3": "Y3", "B4": "Y4", "B5": "Y5"}
	dist1 = map[string]float64{"Y1": 50.0, "Y2": 70.0, "Y3": 90.0, "Y4": 110.0, "Y5": 150.0}
	fmt.Println(Tour(friends1, fTowns1, dist1))
}

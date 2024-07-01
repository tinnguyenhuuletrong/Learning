package kata_test

import (
	"fmt"
	. "kata/traillingZeroNFactorial"
	"reflect"
	"testing"
)

func Test_Factorial_Zeros(t *testing.T) {
	tests := []struct {
		cases [2]int
	}{
		{
			cases: [2]int{0, 0},
		},
		{
			cases: [2]int{6, 1},
		},
		{
			cases: [2]int{30, 7},
		},
	}
	for i, tt := range tests {
		t.Run(fmt.Sprintf("%d", i), func(t *testing.T) {
			ans := Zeros(tt.cases[0])
			if !reflect.DeepEqual(ans, tt.cases[1]) {
				t.Log("ans:", ans)
				t.Fail()
			}
		})
	}
}

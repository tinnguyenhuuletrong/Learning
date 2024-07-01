package kata_test

import (
	. "kata/highestScoringWord"
	"reflect"
	"testing"
)

func Test_HighestScore(t *testing.T) {
	tests := []struct {
		name  string
		cases [2]string
	}{
		{
			name:  "case_1",
			cases: [2]string{"man i need a taxi up to ubud", "taxi"},
		},
		{
			name:  "case_2",
			cases: [2]string{"take me to semynak", "semynak"},
		},
		{
			name:  "case_3",
			cases: [2]string{"aaa b", "aaa"},
		}, {
			name:  "case_4",
			cases: [2]string{"what time are we climbing up the volcano", "volcano"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ans := High(tt.cases[0])
			if !reflect.DeepEqual(ans, tt.cases[1]) {
				t.Log("ans:", ans)
				t.Log("expected:", tt.cases[1])
				t.Fail()
			}
		})
	}
}

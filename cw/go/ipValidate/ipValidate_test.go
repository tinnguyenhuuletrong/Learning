package kata_test

import (
	. "kata/ipValidate"
	"reflect"
	"testing"
)

type TestCase struct {
	name   string
	input  string
	output bool
}

func Test_IP_Validate(t *testing.T) {
	tests := []TestCase{
		{
			name:   "Case 1",
			input:  "12.255.56.1",
			output: true,
		}, {
			name:   "Case 2",
			input:  "",
			output: false,
		}, {
			name:   "Case 3",
			input:  "abc.def.ghi.jkl",
			output: false,
		}, {
			name:   "Case 4",
			input:  "123.456.789.0",
			output: false,
		}, {
			name:   "Case 5",
			input:  "12.34.56",
			output: false,
		}, {
			name:   "Case 6",
			input:  "123.045.067.089",
			output: false,
		}, {
			name:   "Case 7",
			input:  "0.0.0.0",
			output: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ans := Is_valid_ip(tt.input)
			if !reflect.DeepEqual(tt.output, ans) {
				t.Log("Answer:", ans)
				t.Log("Expect:", tt.output)
				t.Fail()
			}
		})
	}
}

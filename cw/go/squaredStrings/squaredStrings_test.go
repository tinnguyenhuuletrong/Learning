package kata_test

import (
	. "kata/squaredStrings"
	"reflect"
	"testing"
)

type TestCase struct {
	name     string
	input    string
	expected string
	exec     func(t *testing.T, a1 string, exp string)
}

func _doCompare(ans string, exp string, t *testing.T, a1 string) {
	if !reflect.DeepEqual(ans, exp) {
		t.Logf("Actual:\n%s \n", ans)
		t.Logf("Expected:\n%s \n", exp)
		t.Fail()
	}
}

func dotestRot90Counter(t *testing.T, a1 string, exp string) {
	var ans = Oper(Rot90Counter, a1)
	_doCompare(ans, exp, t, a1)
}

func dotestDiag2Sym(t *testing.T, a1 string, exp string) {
	var ans = Oper(Diag2Sym, a1)
	_doCompare(ans, exp, t, a1)
}
func dotestSelfieDiag2Counterclock(t *testing.T, a1 string, exp string) {
	var ans = Oper(SelfieDiag2Counterclock, a1)
	_doCompare(ans, exp, t, a1)
}

func Test_Name(t *testing.T) {
	tests := []TestCase{
		{
			name:     "Diag2Sym_1",
			input:    "abcd\nefgh\nijkl\nmnop",
			expected: "plhd\nokgc\nnjfb\nmiea",
			exec:     dotestDiag2Sym,
		},
		{
			name:     "Diag2Sym_2",
			input:    "LmvLyg\nDKELBm\nylJhui\nXRXqHD\nzlisCT\nhPqxYb",
			expected: "bTDimg\nYCHuBy\nxsqhLL\nqiXJEv\nPlRlKm\nhzXyDL",
			exec:     dotestDiag2Sym,
		},
		{
			name:     "Rot90Counter_1",
			input:    "abcd\nefgh\nijkl\nmnop",
			expected: "dhlp\ncgko\nbfjn\naeim",
			exec:     dotestRot90Counter,
		},
		{
			name:     "Rot90Counter_2",
			input:    "EcGcXJ\naaygcA\nNgIshN\nyOrCZE\neBEqpm\nNkxCgw",
			expected: "JANEmw\nXchZpg\ncgsCqC\nGyIrEx\ncagOBk\nEaNyeN",
			exec:     dotestRot90Counter,
		},
		{
			name:     "SelfieDiag2Counterclock_1",
			input:    "abcd\nefgh\nijkl\nmnop",
			expected: "abcd|plhd|dhlp\nefgh|okgc|cgko\nijkl|njfb|bfjn\nmnop|miea|aeim",
			exec:     dotestSelfieDiag2Counterclock,
		},
		{
			name:     "SelfieDiag2Counterclock_2",
			input:    "NJVGhr\nMObsvw\ntPhCtl\nsoEnhi\nrtQRLK\nzjliWg",
			expected: "NJVGhr|gKilwr|rwliKg\nMObsvw|WLhtvh|hvthLW\ntPhCtl|iRnCsG|GsCnRi\nsoEnhi|lQEhbV|VbhEQl\nrtQRLK|jtoPOJ|JOPotj\nzjliWg|zrstMN|NMtsrz",
			exec:     dotestSelfieDiag2Counterclock,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.exec(t, tt.input, tt.expected)
		})
	}
}

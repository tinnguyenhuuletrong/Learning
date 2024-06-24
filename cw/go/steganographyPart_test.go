// https://www.codewars.com/kata/624fc787983b3500648faf11

package kata

import (
	"reflect"
	"testing"
)

func Conceal(msg string, pixels [][]uint8) [][]uint8 {
	if len(msg)*3 > len(pixels) {
		return nil
	}

	bit_at := func(ch byte, idx int) uint8 {
		var bit_offset = 7 - idx%8
		var val = ch & (1 << bit_offset)
		if val == 0 {
			return 0
		} else {
			return 1
		}
	}
	set_lsb := func(ch byte, bit uint8) uint8 {
		if bit == 0 {
			return ch &^ 1
		} else {
			return ch | 1
		}
	}

	var idx = 0
	for m := 0; m < len(msg); m++ {
		var ch = msg[m]
		// println(string(ch))
		for i := 0; i < 8; i++ {
			var bit = bit_at(ch, i)
			var x = (idx) / 3
			var y = (idx) % 3
			var val = pixels[x][y]
			var new_val = set_lsb(val, bit)
			pixels[x][y] = new_val
			// println(idx, "x=", x, ",", "y=", y, "val=", val, "bit=", bit, "new_val=", new_val)
			idx += 1
		}
		idx += 1
	}
	// your code here
	return pixels
}

// go test -run TestConceal
func TestConcealCase1(t *testing.T) {
	case1_msg := "Hello"
	case1_img := [][]uint8{
		{255, 0, 0}, {0, 255, 0}, {0, 0, 255},
		{255, 0, 0}, {0, 255, 0}, {0, 0, 255},
		{169, 105, 71}, {172, 211, 192}, {181, 140, 38},
		{108, 58, 63}, {105, 235, 16}, {204, 69, 21},
		{24, 40, 224}, {88, 84, 121}, {123, 41, 163},
	}
	case1_output := [][]uint8{
		{254, 1, 0}, {0, 255, 0}, {0, 0, 255},
		{254, 1, 1}, {0, 254, 1}, {0, 1, 255},
		{168, 105, 71}, {172, 211, 193}, {180, 140, 38},
		{108, 59, 63}, {104, 235, 17}, {204, 68, 21},
		{24, 41, 225}, {88, 85, 121}, {123, 41, 163},
	}
	case1_res := Conceal(case1_msg, case1_img)
	if !reflect.DeepEqual(case1_res, case1_output) {
		t.Logf("v=%v\ne=%v", case1_output, case1_res)
		t.Fail()
	}
}

func TestConcealCase2(t *testing.T) {
	case2_msg := "This shouldn't fit"
	case2_img := [][]uint8{
		{255, 0, 0}, {0, 255, 0}, {0, 0, 255},
		{255, 0, 0}, {0, 255, 0}, {0, 0, 255},
		{169, 105, 71}, {172, 211, 192}, {181, 140, 38},
		{108, 58, 63}, {105, 235, 16}, {204, 69, 21},
		{24, 40, 224}, {88, 84, 121}, {123, 41, 163},
	}
	case2_res := Conceal(case2_msg, case2_img)
	if case2_res != nil {
		t.Fail()
	}

}

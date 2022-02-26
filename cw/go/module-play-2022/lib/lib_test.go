package moduleplay2022

import "testing"

func Test(t *testing.T) {
	var is_equal = Gretting() == "Hello From Gretting"
	if !is_equal {
		t.Fatalf("not equal")
	}
}

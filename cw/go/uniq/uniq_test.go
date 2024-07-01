package kata_test

import (
	. "kata/uniq"
	"reflect"
	"testing"
)

func Test_Uniq_1(t *testing.T) {
	res := Uniq([]string{"a", "a", "b", "b", "c", "a", "b", "c", "c"})
	ans := []string{"a", "b", "c", "a", "b", "c"}
	if !reflect.DeepEqual(ans, res) {
		t.Log(res)
		t.Fail()
	}
}

func Test_Uniq_2(t *testing.T) {
	res := Uniq([]string{"a", "a", "a", "b", "b", "b", "c", "c", "c"})
	ans := []string{"a", "b", "c"}
	if !reflect.DeepEqual(ans, res) {
		t.Log(res)
		t.Fail()
	}
}

func Test_Uniq_3(t *testing.T) {
	res := Uniq([]string{""})
	ans := []string{""}
	if !reflect.DeepEqual(ans, res) {
		t.Log(res)
		t.Fail()
	}
}

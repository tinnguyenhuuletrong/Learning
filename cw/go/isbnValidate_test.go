package kata

import (
	"fmt"
	"strings"
	"testing"
)

// https://www.codewars.com/kata/51fc12de24a9d8cb0e000001/train/go
func ValidISBN10(isbn string) bool {
	isbn = strings.ToUpper(isbn)
	if len(isbn) != 10 {
		return false
	}

	var sum uint = 0
	for i, v := range isbn {

		if i >= 0 && i < 9 {
			if v < '0' || v > '9' {
				return false
			}
		} else {
			if v < '0' || v > '9' {
				if v != 'X' {
					return false
				}
			}
		}

		val := uint(v) - 48
		if v == 'X' {
			val = 10
		}
		sum += uint(i+1) * val
	}
	return sum%11 == 0
}
func TestValidISBN10Solution(t *testing.T) {
	case1 := "XXXXXXXXXX"
	fmt.Println(ValidISBN10(case1))
}

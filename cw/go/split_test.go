package kata

import (
	"fmt"
	"strings"
	"testing"
)

func Solution(str string) []string {
	var numChars = len(str)

	var strBuilder strings.Builder
	strBuilder.WriteString(str)
	if numChars%2 != 0 {
		strBuilder.WriteString("_")
	}

	var res []string
	var tmpString = strBuilder.String()
	for index := 0; index < strBuilder.Len(); index += 2 {
		res = append(res, tmpString[index:index+2])
	}

	return res
}

// go test -run TestSplitSolution
func TestSplitSolution(t *testing.T) {
	case1 := "abc"
	fmt.Println(Solution(case1))
}

// https://www.codewars.com/kata/57eb8fcdf670e99d9b000272
package kata

import (
	"math"
	"strings"
)

const A = 97 - 1

func High(s string) string {
	tmp := strings.Split(s, " ")
	max_score := math.MinInt32
	ret := ""
	for _, v := range tmp {

		score := 0
		for i := 0; i < len(v); i++ {
			score += (int(v[i]) - A)
		}
		if score > max_score {
			max_score = score
			ret = v
		}

	}

	return ret
}

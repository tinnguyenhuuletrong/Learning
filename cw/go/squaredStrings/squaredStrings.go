package kata

import (
	"fmt"
	"strings"
)

func Rot90Counter(s string) string {
	inp := make([][]string, 0)
	out := make([][]string, 0)
	tmp := strings.Split(s, "\n")
	n := len(tmp)
	for _, value := range tmp {
		tmp := strings.Split(value, "")
		inp = append(inp, tmp)
		out = append(out, make([]string, n))
	}

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			out[n-1-j][i] = inp[i][j]
		}
	}

	out_slice := make([]string, 0)
	for i := 0; i < n; i++ {
		out_slice = append(out_slice, strings.Join(out[i], ""))
	}

	return strings.Join(out_slice, "\n")
}
func Diag2Sym(s string) string {
	inp := make([][]string, 0)
	out := make([][]string, 0)
	tmp := strings.Split(s, "\n")
	n := len(tmp)
	for _, value := range tmp {
		tmp := strings.Split(value, "")
		inp = append(inp, tmp)
		out = append(out, make([]string, n))
	}

	for i := 0; i < n; i++ {
		for j := 0; j < n; j++ {
			out[n-1-j][n-1-i] = inp[i][j]
		}
	}

	out_slice := make([]string, 0)
	for i := 0; i < n; i++ {
		out_slice = append(out_slice, strings.Join(out[i], ""))
	}

	return strings.Join(out_slice, "\n")
}
func SelfieDiag2Counterclock(s string) string {
	diag_res := strings.Split(Diag2Sym(s), "\n")
	rot_res := strings.Split(Rot90Counter(s), "\n")

	out_slice := make([]string, 0)
	tmp := strings.Split(s, "\n")
	for i, value := range tmp {
		out_slice = append(out_slice, fmt.Sprintf("%s|%s|%s", value, diag_res[i], rot_res[i]))
	}

	return strings.Join(out_slice, "\n")
}

type FParam func(string) string

func Oper(f FParam, x string) string {
	return f(x)
}

// 0 1 2 3
// 0   a b c d
// 1   e f g h
// 2   i j k l
// 3   m n o p

// ----------
// Rot90Counter
// ----------
//     0 1 2 3
// 0   d h l p
// 1   c g k o
// 2   b f j n
// 3   a e i m

// 0 0 -> 3 0
// 0 1 -> 2 0
// 0 2 -> 1 0
// 0 3 -> 0 0

// i j -> 3-j, i

// ---------
// Diag2Sym
// ---------
//     0 1 2 3
// 0   p l h d
// 1   o k g c
// 2   n j f b
// 3   m i e a

// 0 0 -> 3 3
// 0 1 -> 2 3
// 0 2 -> 1 3
// 0 3 -> 0 3

// i j -> 3-j, 3-i

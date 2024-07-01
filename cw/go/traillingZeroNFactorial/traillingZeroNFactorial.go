// https://www.codewars.com/kata/52f787eb172a8b4ae1000a34
package kata

func Zeros(n int) int {
	base := 5
	res := 0
	for i := 1; ; i++ {
		tmp := int(n / base)
		if tmp <= 0 {
			break
		}
		res += int(tmp)
		base *= 5
	}
	return res
}

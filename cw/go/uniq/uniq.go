// https://www.codewars.com/kata/52249faee9abb9cefa0001ee
package kata

func Uniq(a []string) []string {
	last := ""
	res := make([]string, 0)
	for i, v := range a {
		if i != 0 && last == v {
			continue
		}
		last = v
		res = append(res, v)
	}
	return res
}

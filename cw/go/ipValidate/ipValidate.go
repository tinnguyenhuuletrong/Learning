// https://www.codewars.com/kata/515decfd9dcfc23bb6000006
package kata

import (
	"log"
	"strconv"
	"strings"
)

func Is_valid_ip(ip string) bool {
	tmp := strings.Split(ip, ".")
	if len(tmp) != 4 {
		return false
	}
	for _, v := range tmp {
		// Leading zeros (e.g. 01.02.03.04) are considered invalid
		if len(v) > 1 && string(v[0]) == "0" {
			return false
		}
		_, err := strconv.ParseUint(v, 10, 8)
		if err != nil {
			log.Println(ip, v, err)
			return false
		}
	}

	return true
}

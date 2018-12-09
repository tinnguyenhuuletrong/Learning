package main

import (
	"fmt"
)

func makeZero(ptr *int) {
	*ptr = 0
}

func main() {
	var x = 5
	fmt.Println("Before", x)
	makeZero(&x)
	fmt.Println("After", x)
}

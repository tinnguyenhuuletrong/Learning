package main

import (
	"fmt"
)

func main() {

	// Constant array
	var x = []float32{1, 2, 3, 5, 6}

	// Array loop
	for _, val := range x {
		fmt.Println(val)
	}

	fmt.Println(x)

	// Allocate array
	var y = make([]float32, 2)
	fmt.Println(y)

	// Copy Array
	var z = copy(y, x)
	fmt.Println(x, y, z)

	// Append value to array
	var y1 = append(y, 99)
	fmt.Println(y1)

}

package main

import "fmt"

func main() {

	// Auto detect type
	var x = "Hello World"
	sum := 1 + 1

	fmt.Println("1 + 1 =", sum)
	fmt.Println(x, x[0]) // -> Hello World 72

	// Define by type
	var y string

	y = "One"
	fmt.Println(y)

	y = "Two"
	fmt.Println(y)

	const (
		one   = 1
		two   = 2
		three = "3"
	)
	fmt.Println("const", one, two, three)

}

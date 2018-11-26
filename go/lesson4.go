package main

import (
	"fmt"
)

func main() {

	// Alloc before use
	var x = make(map[string]int)

	x["key1"] = 1
	x["key2"] = 2
	fmt.Println(x)

	// Delete
	delete(x, "key1")
	fmt.Println(x)

	// Lookup return 2 val
	var val, exist = x["key1"]
	fmt.Println(val, exist)

	// Go Style
	if name, ok := x["key2"]; ok {
		fmt.Println(name, ok)
	}

}

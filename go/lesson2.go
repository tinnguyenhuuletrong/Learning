package main

import "fmt"

func main() {

	fmt.Println("Input number")
	var input float64
	fmt.Scanf("%f", &input)

	var square = input * input

	fmt.Printf("Square = %.1f", square)
	fmt.Println()

	for index := 0; index < int(square); index++ {
		if index%2 == 0 {
			fmt.Printf("even = %d", index)
			fmt.Println()
		}
	}
}

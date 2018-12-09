package main

import (
	"fmt"
)

func sum(args ...int) int {
	var sum = 0
	for _, value := range args {
		sum += value
	}
	return sum
}

func makeEvenGenerator() func() uint {
	i := uint(0)
	return func() (ret uint) {
		ret = i
		i += 2
		return
	}
}

//-------------------------------------------//
//	Defer
//-------------------------------------------//
func first() {
	fmt.Println("1st")
}
func second() {
	fmt.Println("2nd")
}
func deferTest() {
	defer second() // Call when function complete
	first()
}

//-------------------------------------------//
//	Panic and Recover
//-------------------------------------------//
func testPanic(a int) string {
	defer func() {
		tmp := recover()
		fmt.Println(tmp)
	}()

	if a%2 == 0 {
		panic("argument error")
	}

	return "ok"
}

func main() {

	var div = func(a int, b int) float32 {
		return float32(a) / float32(b)
	}
	var s = sum(1, 2, 3, 4, 5)
	fmt.Println(div(s, 5))

	var next = makeEvenGenerator()

	fmt.Println(next())
	fmt.Println(next())
	fmt.Println(next())
	fmt.Println(next())

	deferTest()
	fmt.Println(testPanic(1))
	fmt.Println(testPanic(2))
}

package main

import (
	"fmt"
	"math/rand"
	"time"
)

func f(n int, done chan int) {
	defer func() {
		done <- n
	}()

	for i := 0; i < n; i++ {
		fmt.Println(n, ":", i)
		amt := time.Duration(rand.Intn(250))
		time.Sleep(time.Millisecond * amt)
	}
}

func main() {
	done := make(chan int)
	for i := 0; i < 10; i++ {
		go f(i, done)
	}

	// Waiting for all done. Go Style !
	for i := 0; i < 10; i++ {
		var task = <-done
		fmt.Println("Done", task)
	}

}

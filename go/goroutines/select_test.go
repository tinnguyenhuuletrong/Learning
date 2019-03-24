package main

import (
	"testing"
	"time"
)

func waitingSelect(ch1, ch2 *chan int) {
	println("[Go] Start")
	select {
	case x := <-*ch1:
		println("[Go] Ch1 update", x)
	case y := <-*ch2:
		println("[Go] Ch2 update", y)
	default:
		println("[Go] Default")
	}
	println("[Go] End")
}

func waitingLoopSelect(ch1, ch2 *chan int) {
	println("[Go] Start")
	for {
		select {
		case x := <-*ch1:
			println("[Go] Ch1 update", x)
		case y := <-*ch2:
			println("[Go] Ch2 update", y)
		}
	}
}

func waitingTimeout(ch1, ch2 *chan int) {
	println("[Go] Start")
	select {
	case x := <-*ch1:
		println("[Go] Ch1 update", x)
	case <-time.After(2 * time.Second):
		println("[Go] Timeout")
	}
	println("[Go] End")
}

func TestSelect(t *testing.T) {
	println("[Main] Start")

	ch1 := make(chan int, 10)
	ch2 := make(chan int, 10)

	// go waitingSelect(&ch1, &ch2)
	// go waitingLoopSelect(&ch1, &ch2)
	go waitingTimeout(&ch1, &ch2)

	time.Sleep(3 * time.Second)

	ch1 <- 1
	ch2 <- 2

	time.Sleep(5 * time.Second)

	println("[Main] End")
}

package main

import (
	"testing"
	"time"
)

func runWithBufferedChan(ch *chan int) {
	println("[Go1] runWithChan 1")
	time.Sleep(2 * time.Second)
	println("[Go1] runWithChan 2")
	msg := <-*ch
	println("[Go1] msg", msg)
}

func TestChannelBuffered(t *testing.T) {
	println("[Main] Start")

	// buffered channel of ints
	bufferedChan := make(chan int, 10)

	go runWithBufferedChan(&bufferedChan)
	println("[Main] Buffer 1")

	// Buffered not block
	bufferedChan <- 1

	println("[Main] Buffer 2")

	time.Sleep(5 * time.Second)

	println("[Main] End")
}

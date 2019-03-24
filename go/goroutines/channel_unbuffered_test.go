package main

import (
	"testing"
	"time"
)

func runWithChan(ch *chan int) {
	println("[Go1] runWithChan 1")
	time.Sleep(2 * time.Second)
	println("[Go1] runWithChan 2")
	msg := <-*ch
	println("[Go1] msg", msg)
}

func TestChannel(t *testing.T) {
	println("[Main] Start")

	// unbuffered channel of ints
	unBufferedChan := make(chan int)

	go runWithChan(&unBufferedChan)
	println("[Main] Buffer 1")

	// Unbuffered will wait until consumed
	unBufferedChan <- 1

	println("[Main] End")
}

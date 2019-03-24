package main

import (
	"fmt"
	"testing"
	"time"
)

func runDrainChan(id int, ch *chan int) {
	println(id, "[Go] Start")

	for v := range *ch {
		println(id, v)
		time.Sleep(1 * time.Second)
	}

	v, ok := <-*ch
	println(id, "[Go] rec after close", v, ok)

	println(id, "[Go] End")
}

// Return recieved-only chan
func Publish(text string, delay time.Duration) <-chan struct{} {
	ch := make(chan struct{})
	go func() {
		time.Sleep(delay)
		fmt.Println(text)
		close(ch)
	}()
	return ch
}

func TestChannelClose(t *testing.T) {
	println("[Main] Start")

	// buffered channel of ints
	bufferedChan := make(chan int, 10)

	go runDrainChan(1, &bufferedChan)
	go runDrainChan(2, &bufferedChan)
	println("[Main] Buffer 1")

	// Buffered not block
	bufferedChan <- 1
	bufferedChan <- 2
	bufferedChan <- 3
	bufferedChan <- 4
	close(bufferedChan)

	println("[Main] Buffer 2")

	wait := Publish("End After 5 sec", 5*time.Second)

	// Channel close -> release this
	<-wait

	println("[Main] End")
}

package main

import (
	"sync"
	"testing"
	"time"
)

func TestWaitGroup(t *testing.T) {
	println("[Main] Start")

	sleepTimeout := func(waitingForSec time.Duration, wg *sync.WaitGroup) {
		println("[Go] Start")
		time.Sleep(waitingForSec)
		println("[Go] Done After", waitingForSec)
		wg.Done()
	}

	var wg sync.WaitGroup
	wg.Add(2)

	go sleepTimeout(2*time.Second, &wg)
	go sleepTimeout(3*time.Second, &wg)

	wg.Wait()

	println("[Main] End")
}

package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func data_race() {
	a := 0 // data race
	var wg sync.WaitGroup
	wg.Add(1000)
	for i := 0; i < 1000; i++ {
		go func() {
			defer wg.Done()
			a += 1
		}()
	}
	wg.Wait()
	fmt.Println(a) // could theoretical be any number 0-1000 (most likely above 900)
}

func fix_data_race() {
	var wg sync.WaitGroup
	var a uint32 = 0

	wg.Add(1000)
	for i := 0; i < 1000; i++ {
		go func() {
			defer wg.Done()
			atomic.AddUint32(&a, 1)
		}()
	}
	wg.Wait()
	fmt.Println(a) // will always be 1000
}

func main() {
	// data_race()
	fix_data_race()
}

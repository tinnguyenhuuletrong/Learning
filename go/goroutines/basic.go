package main

import "time"

func runAndPrint(msg string) {
	time.Sleep(1 * time.Second)
	println("RunAndPrint", msg)
}

func main() {
	println("Start")
	go runAndPrint("hello 1")
	go runAndPrint("hello 2")

	// Without this it will not wait
	time.Sleep(2 * time.Second)
	println("End")
}

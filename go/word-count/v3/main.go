package main

import (
	"io"
	"os"
	"runtime"
)

func main() {
	if len(os.Args) < 2 {
		println("no file path specified")
		return
	}
	filePath := os.Args[1]

	file, err := os.Open(filePath)
	if err != nil {
		println(err)
		return
	}
	println(countWordV2(file))
	defer file.Close()
}

func countWordV2(file *os.File) int {
	const bufferSize = 16 * 1024

	type Chunk struct {
		bytes           []byte
		prevByteIsSpace bool
	}

	// Processing Chunk
	countChunk := func(chunk Chunk) int {
		wordCount := 0
		prevByteIsSpace := chunk.prevByteIsSpace
		for _, b := range chunk.bytes {
			if isSpace(b) {
				prevByteIsSpace = true
				continue
			}

			if prevByteIsSpace {
				wordCount++
				prevByteIsSpace = false
			}
		}
		return wordCount
	}

	worker := func(chunks chan Chunk, counts chan int) {
		myTotal := 0
		for {
			chunk, ok := <-chunks
			if !ok {
				break
			}
			count := countChunk(chunk)
			myTotal += count
		}

		// Report
		counts <- myTotal
	}

	counts := make(chan int)
	chunks := make(chan Chunk)

	// Spawn worker
	numWorkers := runtime.NumCPU()
	for i := 0; i < numWorkers; i++ {
		go worker(chunks, counts)
	}

	// Read buffer -> Chunk
	lastCharIsSpace := true
	for {
		buffer := make([]byte, bufferSize)
		length, err := file.Read(buffer)
		if err != nil {
			if err == io.EOF {
				break
			} else {
				panic(err)
			}
		}

		// Push to worker
		chunks <- (Chunk{buffer[:length], lastCharIsSpace})
		lastCharIsSpace = isSpace(buffer[length-1])
	}
	close(chunks)

	// Gather report from worker
	totalWordCount := 0
	for i := 0; i < numWorkers; i++ {
		count := <-counts
		totalWordCount += count
	}
	close(counts)
	return totalWordCount
}

func isSpace(b byte) bool {
	return b == ' ' || b == '\t' || b == '\n' || b == '\r' || b == '\v' || b == '\f'
}

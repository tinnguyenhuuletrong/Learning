package main

import (
	"io"
	"os"
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
	buffer := make([]byte, bufferSize)

	totalWordCount := 0
	prevByteIsSpace := true

	type Chunk struct {
		bytes           []byte
		prevByteIsSpace bool
	}

	// Processing Chunk
	countChunk := func(chunk Chunk) int {
		wordCount := 0
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

	// Read buffer -> Chunk
	for {
		length, err := file.Read(buffer)
		if err != nil {
			if err == io.EOF {
				break
			} else {
				panic(err)
			}
		}
		totalWordCount += countChunk(Chunk{buffer[:length], prevByteIsSpace})
	}
	return totalWordCount
}

func isSpace(b byte) bool {
	return b == ' ' || b == '\t' || b == '\n' || b == '\r' || b == '\v' || b == '\f'
}

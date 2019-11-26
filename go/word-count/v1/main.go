package main

import (
	"bufio"
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
	println(countWordV1(file))
	defer file.Close()
}

func countWordV1(file *os.File) int {
	const bufferSize = 16 * 1024
	reader := bufio.NewReaderSize(file, bufferSize)

	wordCount := 0
	prevByteIsSpace := true
	for {
		b, err := reader.ReadByte()
		if err != nil {
			if err == io.EOF {
				break
			} else {
				panic(err)
			}
		}

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

func isSpace(b byte) bool {
	return b == ' ' || b == '\t' || b == '\n' || b == '\r' || b == '\v' || b == '\f'
}

package main

import "C"

//export Hello
func Hello () *C.char {
  return C.CString("Hello world!. From TTin")
}

// required to build
func main () {}
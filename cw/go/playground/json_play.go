package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

func test1() {
	var ii interface{}
	ii = 1234
	var ib, _ = json.Marshal(ii)
	fmt.Println(string(ib))
}

func _tryParse(str string) interface{} {
	var ii interface{}
	fmt.Println("")
	fmt.Println("Input: ", str)
	if err := json.Unmarshal([]byte(str), &ii); err != nil {
		fmt.Printf("Parse Json Error: %v ", err)
	}
	fmt.Println("Type: ", reflect.TypeOf(ii))
	fmt.Println("Val: ", ii)
	return ii
}

func test2() {
	_tryParse("1234")
	_tryParse("true")
	_tryParse(`["1", {"a": 1}, 3.5]`)
	_tryParse(`{"name": "ttin"}`)
	var tmp = _tryParse(`{"name": "ttin", "age": 30}`)
	fmt.Println(tmp)
}

func _jsonType() {
	type Food struct {
		Id             int     `json:"id"`
		Name           string  `json:"name"`
		FatPerServ     float64 `json:"fat_per_serv"`
		ProteinPerServ float64 `json:"protein_per_serv"`
		CarbPerServ    float64 `json:"carb_per_serv"`
	}
	f := Food{200403, "Broccoli", 0.3, 2.5, 3.5}
	fS, _ := json.MarshalIndent(f, "", "  ")
	fmt.Println(string(fS))

	// Parse
	var val Food
	json.Unmarshal(fS, &val)
	fmt.Println(val, reflect.TypeOf(val))
}

func main() {
	_jsonType()
}

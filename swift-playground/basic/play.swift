let name = "Tintin"
let year : Int = 2023

let copyRight = "@ \(name.uppercased()) - \(year)"

print("Name: ", name)
print("Year: ", year)
print("CopyRight: ", copyRight)

// Array 
var arrVal = [1,2,3]
func addXTime(arr : inout [Int], withVal: Int, repeatNum: Int = 1) -> Void {
  for _ in 0...repeatNum {
    arr.append(withVal) 
  }
}
print("arrVal: ", arrVal)
addXTime(arr: &arrVal, withVal: 9, repeatNum: 10)
print("after addXTime: ", arrVal)



// Dictionary
var airports: [String: String] = ["YYZ": "Toronto Pearson", "DUB": "Dublin"]
print("Dictonary: ", airports)
print("The airports dictionary contains \(airports.count) items.")
if airports.isEmpty {
    print("The airports dictionary is empty.")
} else {
    print("The airports dictionary isn't empty.")
}
if let oldValue = airports.updateValue("Dublin Airport", forKey: "DUB") {
    print("The old value for DUB was \(oldValue).")
}
airports["APL"] = "Apple International"
for (airportCode, airportName) in airports {
    print("\(airportCode): \(airportName)")
}


// Closure
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}
var descNames = names.sorted(by: backward)
print("names:", names)
print("descNames:", descNames)


// Closure expression syntax - trailing
var ascNames = names.sorted() {s1,s2 in 
  s1 < s2
}
print("ascNames:", ascNames)

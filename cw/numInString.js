let highNum = 1
let sequenceStr = ""

function pbcopy(data) {
    var proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data); proc.stdin.end();
}

function updateString(offset = 100) {
	nextHighNum = highNum + offset
	for (var i = highNum; i < nextHighNum; i++) {
		sequenceStr = sequenceStr.concat(i)
	}

	highNum += offset
}

function findPosition(string) {
	updateString(1000000)
	let offset = 0;
	const re = new RegExp(String(string),"g")
	match = re.exec(sequenceStr)
	while(match == null) {
		offset += sequenceStr.length
		sequenceStr = ""
		updateString(1000000)
		match = re.exec(sequenceStr)
	}

	return match.index + offset
}

console.log(findPosition(process.argv[2]))
// function numInString(string) {
// 	const res = []
// 	const re = new RegExp(String(string),"g")
// 	while ((match = re.exec(sequenceStr)) != null) {
// 		res.push(match.index)
// 	}
// 	return res
// }



// updateString(999)
// let res = numInString(process.argv[2])
// res.forEach(itm => console.log(itm))
// console.log(sequenceStr)
// pbcopy(sequenceStr)
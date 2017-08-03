const MidiConvert = require("midiconvert")
const fs = require("fs")

let input = null
let output = null

if (process.argv.length <= 2) {
    console.log("Usage: -i" + " <midi_input>" + " -o" + " <midi_output>");
    process.exit(-1);
}

for (var i = 0; i < process.argv.length; i++) {
	if( process.argv[i] == '-i' )
		input = process.argv[++i]
	else if( process.argv[i] == '-o' )
		output = process.argv[++i]
}

if(input == null || output == null) {
	console.log("Usage: -i" + " <midi_input>" + " -o" + " <midi_output>");
    process.exit(-1);
}
 
fs.readFile(input, "binary", function(err, midiBlob) {
	if (!err) {
		var midi = MidiConvert.parse(midiBlob)

		midi.tracks = midi.tracks.map(itm => {

			const res = Object.assign({}, itm)
			let transformData = []
			res.controlChanges = Object.keys(res.controlChanges).forEach(ctr => {

				transformData = transformData.concat(res.controlChanges[ctr].map(evn => {
					return Object.assign({}, evn, {
						command: ctr
					})
				}))
			})

			res.controlChanges = transformData;

			return res
		})

		
		fs.writeFileSync(output, JSON.stringify(midi))
	}
})
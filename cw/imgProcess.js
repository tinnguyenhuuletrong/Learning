function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
};

function getPixel(data, x, y, width, height) {
	
	x = clamp(x, 0, width - 1)
	y = clamp(y, 0, height - 1) * 3
	
	let r = data[x * 3 + y * height]
	let g = data[x * 3 + y * height + 1]
	let b = data[x * 3 + y * height + 2]
	return {r: r, g: g, b: b}
}

function applyKernal(data, x, y, width, height, weights) {
	const n = weights.length;
	const m = Math.floor(n/2)
	let res = { r: 0, g: 0, b: 0 }
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			let kx = i - m;
			let ky = j - m;
			let pixelVal = getPixel(data, x + kx, y + ky, width, height)


			res.r += pixelVal.r * weights[i][j]
			res.g += pixelVal.g * weights[i][j]
			res.b += pixelVal.b * weights[i][j]
		}	
	}

	return res
}

function processImage(imageData, height, width, weights){
  const res = Array.from(imageData)
  for (var i = 0; i < width; i++) {
  	for (var j = 0; j < height; j++) {
  		let index = i * 3 + j * height * 3
  		let val = applyKernal(imageData, i, j, width, height, weights)
  		res[index] = clamp( Math.round(val.r), 0, 255)
  		res[index + 1] = clamp( Math.round(val.g), 0, 255)
  		res[index + 2] = clamp( Math.round(val.b), 0, 255)
  	}
  }
  return res
}

console.log(processImage([0,0,0,0,0,0,0,0,0,255,255,255],2,2,[[0.2,0,0],[0,0.2,0.2],[0,0.2,0.2]]))
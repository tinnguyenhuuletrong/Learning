const fs = require('fs')
const cv = require('opencv4nodejs')
const { drawBlueRect } = require('./utils')

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

async function faceDetect(rawImg) {
    const img = await rawImg.resizeToMaxAsync(512);

    const grayScaleImg = await img.bgrToGrayAsync();

    const result = await classifier.detectMultiScaleAsync(grayScaleImg)

    const { objects, numDetections } = result
    console.log('faceRects:', objects);
    console.log('confidences:', numDetections);

    for (const rect of result.objects) {
        drawBlueRect(img, rect);
    }

    cv.imshowWait('face detection', img);
}

async function faceDetectFromFile(filePath) {
    const rawImg = await cv.imreadAsync(filePath);
    faceDetect(rawImg)
}

async function faceDetectFromBuffer(buffer) {
    const rawImg = await cv.imdecodeAsync(buffer);
    faceDetect(rawImg)
}

const buffer = fs.readFileSync('./id_card_vn.jpg')
faceDetectFromBuffer(buffer)

// faceDetectFromFile('./id_card_vn.jpg')
const fs = require('fs')
const nj = require('numjs')
const cv = require('opencv4nodejs')
const { drawBlueRect } = require('./utils')

async function faceDetectFromFile(filePath) {
    const rawImg = await cv.imreadAsync(filePath);
    passportRMZ(rawImg)
}

async function faceDetectFromBuffer(buffer) {
    const rawImg = await cv.imdecodeAsync(buffer);
    passportRMZ(rawImg)
}

//--------------------------------------------------//
// https://www.pyimagesearch.com/2015/11/30/detecting-machine-readable-zones-in-passport-images/
//--------------------------------------------------//

async function resizeMaxHeight(img, height) {
    const w = img.sizes[1];
    const h = img.sizes[0];
    
    const r = w / h;
    return await img.resizeAsync(height, Math.floor(r * height))
}

async function passportRMZ(rawImg) {
    const rectKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(13, 5))
    const sqKernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(15, 15))

    rawImg = await resizeMaxHeight(rawImg, 600)
    let gray = await rawImg.bgrToGray()

    let blur = await gray.gaussianBlurAsync(new cv.Size(3, 3), 0);
    const blackhat = await blur.morphologyExAsync(rectKernel, cv.MORPH_BLACKHAT)

    const filter = await blackhat.sobelAsync(-1, 1, 0, 1)
    const absImg = filter.abs()
    const minMaxVal = absImg.minMaxLoc();
    const normalizeSobelImg = absImg.mul(255 / (minMaxVal.maxVal - minMaxVal.minVal)) 

    const gradX = await normalizeSobelImg.morphologyExAsync(rectKernel, cv.MORPH_CLOSE)
    let thresh = await gradX.thresholdAsync(0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)

    thresh = await thresh.morphologyExAsync(sqKernel, cv.MORPH_CLOSE)
    thresh = await thresh.erodeAsync(new cv.Mat(), new cv.Point2(-1, -1), 4)

    // find contours in the thresholded image and sort them by their area
    let cnts = await thresh.findContoursAsync(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    cnts = cnts.sort((a, b) => b.area - a.area)
    
    const imgWidth = gray.sizes[1]
    const imgHeight = gray.sizes[0]
    const imgRec = new cv.Rect(0, 0, imgWidth, imgHeight)
    let roi;
    for (const itm of cnts) {
        const rect = itm.boundingRect()
        const aspectRatio = rect.width / rect.height
        const coverageWidth = rect.width / imgWidth

        // Magic number 5 and 0.75 :)))
        if (aspectRatio > 5 && coverageWidth > 0.75) {
            const padRec = rect.pad(1.2).and(imgRec)

            roi = gray.getRegion(padRec)
            break;
        }
    }

    cv.imshow('1', normalizeSobelImg);
    cv.imshow('2', thresh);
    if (roi) {
        await cv.imwriteAsync('tmp.jpg', roi)
        cv.imshowWait('mrz', roi);
    } else {
        cv.imshowWait('mrz', gray)
    }
}

const buffer = fs.readFileSync('./doc/python-mrz/examples/passport_04.jpg')
// const buffer = fs.readFileSync('./passport_me.jpg')
faceDetectFromBuffer(buffer)
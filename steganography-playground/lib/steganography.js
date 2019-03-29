/**
Based on the idea outlined here: https://null-byte.wonderhowto.com/how-to/steganography-hide-secret-data-inside-image-audio-file-seconds-0180936/
*/

const sharp = require('sharp')
const assert = require('assert')

const MAGIC_SIGNATURE = Buffer.from('pfUmCGXy')

function unpackBit(b, pixel, position) {
  if (pixel & 1) {
    return (b |= 1 << (7 - position))
  }
  return b
}

function packBit(pixel, bit) {
  if (bit) {
    return (pixel |= 1)
  } else {
    return (pixel &= ~1)
  }
}

function _error(error) {
  console.error(error)
  throw error
}

function embedSection(imgObject, embededBuffer) {
  const buffer = imgObject.data
  let offset = imgObject._offset || 0

  const requiredLength = embededBuffer.length * 8
  if (buffer.length - offset < requiredLength) {
    return _error('not enough space to embed')
  }

  var octect
  for (var i = 0; i < embededBuffer.length; i++) {
    octect = embededBuffer[i]

    for (var j = 0; j < 8; j++) {
      if (octect & (1 << (7 - j))) {
        bit = 1
      } else {
        bit = 0
      }
      buffer[offset] = packBit(buffer[offset], bit)
      offset++
    }
  }

  imgObject._offset = offset
}

function readSection(imgObject, length) {
  const imgBuffer = imgObject.data
  let offset = imgObject._offset || 0

  let buffer = []

  let bitPos = 0
  let b = 0
  while (buffer.length !== length) {
    octect = imgBuffer[offset++]
    b = unpackBit(b, octect, bitPos++)
    if (bitPos === 8) {
      buffer.push(b)
      bitPos = 0
      b = 0
    }
  }

  imgObject._offset = offset
  return Buffer.from(buffer)
}

async function encodeImageFromFile(imageFile, embededBuffer, options = {}) {
  let inputFormat = 'jpg'
  let imgObject
  try {
    imgObject = await sharp(imageFile)
      .metadata((err, metadata) => (inputFormat = metadata.format))
      .raw()
      .toBuffer({ resolveWithObject: true })
  } catch (error) {
    _error(error)
  }

  const {
    data,
    info: { width, height, channels, size }
  } = imgObject

  const maxCap = (size - MAGIC_SIGNATURE.length - 16) / 8
  const dataSize = embededBuffer.length

  if (options.debug) {
    console.log(`File Type: ${inputFormat}`)
    console.log(`Image Size: ${width} x ${height} x ${channels}`)
    console.log(`Maximum Data Size: ${maxCap} bytes`)
    console.log(`Data Size: ${dataSize} bytes`)
    console.log(`Usage percentage: ${(dataSize * 100) / maxCap} %`)
  }

  var contentLengthBuffer = Buffer.alloc(16)
  contentLengthBuffer.writeUInt32LE(embededBuffer.length, 0)

  embedSection(imgObject, MAGIC_SIGNATURE)
  embedSection(imgObject, contentLengthBuffer)
  embedSection(imgObject, embededBuffer)

  return sharp(imgObject.data, { raw: { width, height, channels } })
    .toFormat(inputFormat)
    .toBuffer()
}

async function decodeImageFromFile(imageFile) {
  let imgObject
  try {
    imgObject = await sharp(imageFile)
      .raw()
      .toBuffer({ resolveWithObject: true })
  } catch (error) {
    _error(error)
  }

  const signatureBuffer = readSection(imgObject, MAGIC_SIGNATURE.length)
  if (Buffer.compare(signatureBuffer, MAGIC_SIGNATURE) !== 0)
    return _error(new Error('Invalid magic signature'))

  let contentLengthBuffer = readSection(imgObject, 16)
  const contentLength = contentLengthBuffer.readUInt32LE()

  const dataBuffer = readSection(imgObject, contentLength)
  return dataBuffer
}

module.exports = {
  encodeImageFromFile,
  decodeImageFromFile
}

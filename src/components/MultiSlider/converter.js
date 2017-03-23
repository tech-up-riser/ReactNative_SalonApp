'use strict'

const converter = {
  valueToPosition: function (value, valuesArray, sliderLength) {
    let arrLength
    const index = valuesArray.indexOf(value)

    if (index === -1) {
      console.log('Invalid value, array does not contain: ', value)
      return null
    } else {
      arrLength = valuesArray.length - 1
      return sliderLength * index / arrLength
    }
  },
  positionToValue: function (position, valuesArray, sliderLength) {
    let arrLength
    let index

    if (position < 0 || sliderLength < position) {
      console.log('invalid position: ', position)
      return null
    } else {
      arrLength = valuesArray.length - 1
      index = arrLength * position / sliderLength
      return valuesArray[Math.round(index)]
    }
  },
  createArray: function (start, end, step) {
    let length
    const direction = start - end > 0 ? -1 : 1
    const result = []
    if (!step) {
      console.log('invalid step: ', step)
      return result
    } else {
      length = Math.abs((start - end) / step) + 1
      for (let i = 0; i < length; i++) {
        result.push(start + i * Math.abs(step) * direction)
      }
      return result
    }
  }
}

module.exports = converter

import { VIEWPORT } from '../constants'
const STANDARD_WIDTH = 375
const CURRENT_WIDTH = VIEWPORT.width
const K = CURRENT_WIDTH / STANDARD_WIDTH

const USE_FOR_BIGGER_SIZE = true

export function dynamicSize (size) {
  return Math.round(K * size)
}

export function getFontSize (size) {
  if (USE_FOR_BIGGER_SIZE || CURRENT_WIDTH < STANDARD_WIDTH) {
    const newSize = dynamicSize(size)
  //  console.log('getFontSize', size, 'result', newSize)
    return newSize
  } else {
  //  console.log('getFontSize', size, 'result', size)
    return size
  }
}

import * as types from '../constants/actionsTypes.js'

export function setSearchingText (searchingText) {
  return {
    type: types.SET_SEARCHING_TEXT,
    searchingText
  }
}

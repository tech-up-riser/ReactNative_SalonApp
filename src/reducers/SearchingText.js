import * as types from '../constants/actionsTypes.js'

export default function searchingText (state = '', action) {
  switch (action.type) {
    case types.SET_SEARCHING_TEXT:
      return action.searchingText
    default:
      return state
  }
}

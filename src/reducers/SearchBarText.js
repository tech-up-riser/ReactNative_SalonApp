import * as types from '../constants/actionsTypes.js'

export default function searchBarText (state = '', action) {
  switch (action.type) {
    case types.SET_SEARCH_BAR_TEXT:
      return action.searchBarText
    default:
      return state
  }
}

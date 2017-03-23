import * as types from '../constants/actionsTypes.js'

export function setSearchBarText (searchBarText) {
  return {
    type: types.SET_SEARCH_BAR_TEXT,
    searchBarText
  }
}

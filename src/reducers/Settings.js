import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function settings (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_SETTINGS:
      return action.settings
    default :
      return state
  }
}

import * as types from '../constants/actionsTypes.js'

export default function forgottenEmail (state = null, action = '') {
  switch (action.type) {
    case types.SET_FORGOTTEN_EMAIL:
      return action.forgottenEmail
    case types.CLEAR_FORGOTTEN_EMAIL:
      return null
    default:
      return state
  }
}

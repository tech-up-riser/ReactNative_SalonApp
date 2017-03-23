import * as types from '../constants/actionsTypes.js'

export function setForgottenEmail (forgottenEmail) {
  return {
    type: types.SET_FORGOTTEN_EMAIL,
    forgottenEmail
  }
}

export function clearForgottenEmail () {
  return {
    type: types.CLEAR_FORGOTTEN_EMAIL
  }
}

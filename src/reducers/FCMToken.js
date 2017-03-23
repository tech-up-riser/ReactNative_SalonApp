import * as types from '../constants/actionsTypes.js'

const initialState = null

export default function (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_FCM_TOKEN:
      return action.token
    default :
      return state
  }
}

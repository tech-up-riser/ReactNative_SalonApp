import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_USER:
      return action.user
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}

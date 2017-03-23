import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function salons (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_SALONS:
      return action.salons
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}

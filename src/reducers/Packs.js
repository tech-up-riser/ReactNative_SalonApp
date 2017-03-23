import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function packs (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_PACKS:
      return action.packs
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}

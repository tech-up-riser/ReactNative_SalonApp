import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function requests (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_REQUEST:
      const request = action.request
      request.id = action.id
      return {
        ...state,
        [action.id]: request
      }
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}

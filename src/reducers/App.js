import * as types from '../constants/actionsTypes'

const initialState = {
  root: undefined, // 'login' / 'after-login',
  updateId: 0
}

export default function app (state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return {
        ...state,
        root: action.root,
        updateId: action.force ? state.updateId + 1 : state.updateId
      }
    default:
      return state
  }
}

export const NAVIGATE = 'NAVIGATE'
export const NAV_PUSH = 'NAV_PUSH'
export const NAV_POP = 'NAV_POP'
export const NAV_JUMP_TO_KEY = 'NAV_JUMP_TO_KEY'
export const NAV_JUMP_TO_INDEX = 'NAV_JUMP_TO_INDEX'
export const NAV_RESET = 'NAV_RESET'
export const NAV_SET = 'NAV_SET'

// *** Action Creators ***

export function pushScreen (state) {
  state = typeof state === 'string' ? { key: state, title: state } : state
  return {
    type: NAV_PUSH,
    state
  }
}

export function popScreen () {
  return {
    type: NAV_POP
  }
}

export function navigateJumpToKey (key) {
  return {
    type: NAV_JUMP_TO_KEY,
    key
  }
}

export function navigateJumpToIndex (index) {
  return {
    type: NAV_JUMP_TO_INDEX,
    index
  }
}

export function navigateReset (routes, index) {
  return {
    type: NAV_RESET,
    index,
    routes
  }
}

export function setScreen (key) {
  return {
    type: NAV_SET,
    key
  }
}

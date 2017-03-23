import { RECEIVE_FCM_TOKEN } from '../constants/actionsTypes'

export function receiveFcmToken (token) {
  return {
    type: RECEIVE_FCM_TOKEN,
    token
  }
}

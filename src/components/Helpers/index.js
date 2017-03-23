import { AsyncStorage } from 'react-native'
import * as FirebaseChilds from '../../constants/FirebaseChilds'
import { AUTH_TOKEN_KEY } from '../../constants'

export function trimNoDigits (str) {
  return str.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
}

export function logIn (authData, firebaseRef, setAuthData, setUserData, callback) {
  setAuthData(authData)
  firebaseRef.child(FirebaseChilds.USERS).child(authData.uid).once('value', (snapshot) => {
    setUserData(snapshot.val())
    AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.token, () => {
      callback()
    })
  })
}

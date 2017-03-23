import { LOGOUT } from '../constants/actionsTypes'
import { NAV_ROOT_SIGN_UP } from '../constants/NavState'
import { Alert } from 'react-native'
import { auth } from '../constants/firebase'
import { createDBUserPromise} from './initAC'
import firebase from 'firebase'
import { FBLoginManager } from 'react-native-facebook-login'
import { changeAppRoot, onDisconnect } from './initAC'

export function logoutAction () {
  return {
    type: LOGOUT
  }
}

export function userDefault (authData, name = 'Anonimous', phone = '') {
  return {
    id: authData.uid,
    name: (authData.displayName) ? authData.displayName : name,
    email: authData.email,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    phone
  }
}

export function logout () {
  return function * (dispatch, getState) {
    FBLoginManager.logout((error, data) => {
      console.log('fb logout', error, data)
    })
    onDisconnect()
    dispatch(logoutAction())
    yield auth.signOut()
  }
}

function * createUser (email, password, dispatch, tryCnt = 1) {
  console.log('createUser', email, password, tryCnt)
  try {
    const authData = yield auth.createUserWithEmailAndPassword(email, password)
    console.log('Successfully created user account with uid:', authData.uid)
    return authData
  } catch (error) {
    console.log('create user error', error)
    dispatch(changeAppRoot(NAV_ROOT_SIGN_UP))
    switch (error.code) {
      case 'auth/email-already-in-use':
        Alert.alert(
            'The new user account cannot be created',
            error.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
        )
        return null
      case 'auth/invalid-email':
        Alert.alert(
            'The specified email is not a valid email.',
            '',
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
        )
        return null
      case 'auth/operation-not-allowed':
        Alert.alert(
            'Operation is not allowed',
            '',
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
        )
        return null
      case 'auth/weak-password':
        Alert.alert(
            'Invalid password.',
            'The specified password is not strong enough.',
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
        )
        return null
      case 'auth/network-request-failed':
        console.log('A network error has occurred.')
        if (tryCnt < 3) {
          const res = yield createUser(email, password, dispatch, tryCnt + 1)
          return res
        } else {
          Alert.alert(
              'Network error.',
              'A network error has occurred.',
              [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
          )
          return null
        }
    }
  }
}

export function processSignIn (email, password, onComplete, tryCnt = 1) {
  return function * (dispatch, getState) {
    try {
      console.log('processSignIn', email, password, tryCnt)
      try {
//        reconnect()
//        database.goOnline()
        yield auth.signInWithEmailAndPassword(email, password)
        // onComplete()
      } catch (error) {
        if (error) {
          switch (error.code) {
            case 'auth/invalid-email':
              console.log('The specified user account email is invalid.')
              onComplete()
              Alert.alert(
                  'The specified user account email is invalid.',
                  '',
                  [{text: 'OK'}]
              )
              break
            case 'auth/user-disabled':
              console.log('The user corresponding to the given email has been disabled.')
              onComplete()
              Alert.alert(
                  'The user corresponding to the given email has been disabled.',
                  '',
                  [{text: 'OK'}]
              )
              break
            case 'auth/wrong-password':
              console.log('The specified user account password is incorrect.')
              onComplete()
              Alert.alert(
                  'The specified user account password is incorrect.',
                  '',
                  [{text: 'OK'}]
              )
              break
            case 'auth/user-not-found':
              console.log('The specified user account does not exist.')
              onComplete()
              Alert.alert(
                  'The specified user account does not exist.',
                  '',
                  [{text: 'OK'}]
              )
              break
            case 'auth/too-many-requests':
              console.log('The specified user account does not exist.')
              onComplete()
              Alert.alert(
                  'Try again later.',
                  'We have blocked all requests from this device due to unusual activity.',
                  [{text: 'OK'}]
              )
              break
            case 'auth/network-request-failed':
              console.log('A network error has occurred.')
              if (tryCnt < 3) {
                dispatch(processSignIn(email, password, onComplete, tryCnt + 1))
              } else {
                onComplete()
                Alert.alert(
                    'Network error.',
                    'A network error has occurred.',
                    [{text: 'OK'}]
                )
              }
              break
            default:
              console.log('----------> Error logging user in:', error)
              onComplete()
              Alert.alert(
                  'Something wrong',
                  error.message,
                  [{text: 'OK'}]
              )
          }
        }
      }
    } catch (e) {
      console.error(e.stack)
    }
  }
}

export function processFacebookSignIn (data, onComplete, tryCnt = 1) {
  return function * (dispatch, getState) {
    console.log('processFacebookSignIn', data, tryCnt)
    try {
    //  dispatch(changeAppRoot(NAV_ROOT_LOADING))
  //    reconnect()
      const credential = firebase.auth.FacebookAuthProvider.credential(data.credentials.token)
      console.log('credential', credential)
      yield auth.signInWithCredential(credential)
      // onComplete()
    } catch (error) {
      console.log(error)
      if (error && error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            console.log('The specified user account does not exist.')
            onComplete()
            Alert.alert(
                'The specified user account does not exist.',
                '',
                [{text: 'OK'}]
            )
            break

          case 'auth/user-disabled':
            console.log('User is disabled')
            onComplete()
            Alert.alert(
                'The specified user account is disabled.',
                '',
                [{text: 'OK'}]
            )
            break

          case 'auth/network-request-failed':
            console.log('A network error has occurred.')
            if (tryCnt < 3) {
              dispatch(processFacebookSignIn(data, onComplete, tryCnt + 1))
            } else {
              onComplete()
              Alert.alert(
                  'Network error.',
                  'A network error has occurred.',
                  [{text: 'OK'}]
              )
            }
            break

          default:
            console.log('----------> Error logging user in:', error)
            onComplete()
            Alert.alert(
                'Something wrong',
                error.message,
                [{text: 'OK'}]
            )

        }
      }
    }
  }
}

export function signUp (name, email, password, phone, onComplete, tryCnt = 1) {
  return function * (dispatch, getState) {
    console.log('signUp', name, email, password, phone, tryCnt)

//    dispatch(updateSignUpData({ name, email, password, phone, ageOfChild }))
  //  dispatch(changeAppRoot(NAV_ROOT_LOADING))
  //  reconnect()
    try {
      const authData = yield createUser(email, password, dispatch)
      console.log('createUser return', authData)
      if (authData) {
        const user = userDefault(authData, name, phone)
        console.log('try to createDBUser', user)
        yield createDBUserPromise(user)
        yield auth.signInWithEmailAndPassword(email, password)
        onComplete()
      } else {
        onComplete()
      }
    } catch (error) {
      console.log(error)
      if (error && error.code) {
        switch (error.code) {
          case 'auth/network-request-failed':
            console.log('A network error has occurred.')
            if (tryCnt < 3) {
              dispatch(signUp(name, email, password, phone, onComplete, tryCnt + 1))
            } else {
              Alert.alert(
                  'Network error.',
                  'A network error has occurred.',
                  [{text: 'OK', onPress: () => onComplete()}]
              )
            }
            break

          default:
            console.log('----------> Error logging user in:', error)
            Alert.alert(
                'Something wrong',
                error.message,
                [{text: 'OK', onPress: () => onComplete()}]
            )
        }
      }




      console.log('signUp', e)
      // dispatch(changeAppRoot(NAV_ROOT_SIGN_UP))
      Alert.alert(
        'Check your internet connection, please',
        '',
        [{text: 'OK', onPress: () => onComplete()}]
      )
    }
  }
}

export function sendPasswordResetEmail (email, onComplete) {
  return function * (dispatch, getState) {
    try {
      console.log('send verifiction code to email', email)
      yield auth.sendPasswordResetEmail(email)
//      onComplete()
      Alert.alert(
          'We sent you a message',
          'Follow the instructions that have been sent to your email',
          [{text: 'OK', onPress: () => onComplete()}]
      )
    } catch (error) {
      console.log(error)
      if (error && error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            console.log('There is no user corresponding to the email address')
            Alert.alert(
                'Something wrong',
                'There is no user corresponding to the email address',
                [{text: 'OK', onPress: () => onComplete()}]
            )
            break

          case 'auth/invalid-email':
            console.log('invalid email')
            Alert.alert(
                'Something wrong',
                'The email address is not valid',
                [{text: 'OK', onPress: () => onComplete()}]
            )
            break

          default :
            onComplete()

        }
      }
    }
  }
}

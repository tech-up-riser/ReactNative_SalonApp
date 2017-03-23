'use strict'
import * as types from '../constants/actionsTypes'
import * as navStates from '../constants/NavState'
import { auth, ref } from '../constants/firebase'
import { userDefault } from './authAC'
import { clearChargeListeners } from './checkoutAC'
import { clearChargeCancellationListeners } from './checkoutCancellationAC'
import * as _ from 'lodash'

export let listeners = []

export function receiveSettings (settings) {
  return {
    type: types.RECEIVE_SETTINGS,
    settings
  }
}

export function receiveUser (user) {
  return {
    type: types.RECEIVE_USER,
    user
  }
}

export function receiveRequest (id, request) {
  return {
    type: types.RECEIVE_REQUEST,
    id,
    request
  }
}

export function changeAppRoot (root, force = false) {
  return {
    type: types.ROOT_CHANGED,
    root: root,
    force
  }
}

export function receiveSalons (salons) {
  return {
    type: types.RECEIVE_SALONS,
    salons
  }
}

export function receivePacks (packs) {
  return {
    type: types.RECEIVE_PACKS,
    packs
  }
}

export function createDBUser (user) {
  console.log('createDBUser', user)
  ref.child('users').child(user.id).update(user)
}

export function * createDBUserPromise (user) {
  console.log('createDBUser', user)
  yield ref.child('users').child(user.id).update(user)
}

export function initUser (authData) {
  return function * (dispatch, getState) {
    const userId = authData.uid
    console.log('++++++++++++++++++ fetch user', userId)

    const l = ref.child('users').child(userId).on('value', (userSN) => {
      const user = userSN.val()
      if (!user || !_.has(user, 'id')) {
        //console.log('user', userId, user, 'is not exists in the database')
        const user = userDefault(authData)
        console.log('user for saving to db', user)
        const state = getState()
        if (state.fcmToken) user.fcmToken = state.fcmToken
        createDBUser(user)
      } else {
        // console.log('on value user received', user)
        dispatch(receiveUser(user))
        // fetch requests

        const state = getState()
        const requests = state.requests
        if (_.has(user, 'requests')) {
          for (let reqId in user.requests) {
            if (!_.has(requests, reqId)) {
              ref.child('requests').child(reqId).once('value', (reqSN) => {
                const req = reqSN.val()
                dispatch(receiveRequest(reqId, req))
              })
            }
            console.log('try to fetch reqId', reqId)
          }
        }
        // update users FCM token
        if (state.fcmToken && state.fcmToken !== user.fcmToken) {
          ref.child('users').child(userId).child('fcmToken').set(state.fcmToken)
        }
      }
    }, (er) => {
      console.log(er)
      ref.child('users').child(userId).off('value')
    })

    listeners.push(['value', l])

    dispatch(changeAppRoot(navStates.NAV_ROOT_MAIN))
  }
}

export function fetchSalons () {
  return function * (dispatch, getState) {
    const salonsSN = yield ref.child('salons').once('value')
    const salons = salonsSN.val()
    dispatch(receiveSalons(salons))
  }
}

function fetchPacks (dispatch) {
  const l = ref.child('packs').on('value', (packsSN) => {
    const packs = packsSN.val()
    dispatch(receivePacks(packs))
  })
  listeners.push(['value', l])
}

export function appInitialized () {
  return function * (dispatch, getState) {
    console.log('appInitialized action')
    dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))
    const settingsSN = yield ref.child('settings').once('value')
    const settings = settingsSN.val()
    dispatch(receiveSettings(settings))
  //  dispatch(checkAuth())
    auth.onAuthStateChanged((authData) => {
      // console.log('onAuthStateChanged', authData)
      if (authData) {
        // dispatch(receiveAuthData(authData))
        dispatch(fetchSalons())
        fetchPacks(dispatch)
        dispatch(initUser(authData))
      } else {
        dispatch(changeAppRoot(navStates.NAV_ROOT_WALKTHROUGH))
      //  dispatch(logout())
      }
    })
  }
}

export function onDisconnect () {
  console.log('DO ON DISCONNECT')
  for (let l of listeners) {
    console.log('clearListener', l)
    ref.off(l[0], l[1])
  }
  listeners = []
  clearChargeListeners()
  clearChargeCancellationListeners()
}

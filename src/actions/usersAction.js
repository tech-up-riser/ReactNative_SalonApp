import * as types from '../constants/actionsTypes.js'
import firebase from 'firebase'
import { floatTimeToHoursMinutes } from '../utils/time'
import moment from 'moment'
import { ref } from '../constants/firebase'

export function setAuthData (authData) {
  return {
    type: types.SET_AUTH_DATA,
    authData
  }
}

export function setUserData (userData) {
  return {
    type: types.SET_USER_DATA,
    userData
  }
}

export function addRequest (request, onComplete) {
  return function * (dispatch, getState) {
    try {
      console.log('addRequest', request)
      const state = getState()
      // const hm1 = floatTimeToHoursMinutes(request.times[0])
      // const hm2 = floatTimeToHoursMinutes(request.times[1])
      // const dateStartMoment = moment(request.selectedDate)
      // dateStartMoment.set('hour', hm1.hours)
      // dateStartMoment.set('minute', hm1.minutes)
      // dateStartMoment.set('second', 0)
      // dateStartMoment.set('millisecond', 0)
      // const dateEndMoment = moment(request.selectedDate)
      // dateEndMoment.set('hour', hm2.hours)
      // dateEndMoment.set('minute', hm2.minutes)
      // dateEndMoment.set('second', 0)
      // dateEndMoment.set('millisecond', 0)
      const dbReq = {
        dateCreate: firebase.database.ServerValue.TIMESTAMP,
        dateStart: request.times[0].toISOString(),
        dateEnd: request.times[1].toISOString(),
        lat: request.lat,
        lng: request.lng,
        address: request.address,
        userId: state.user.id,
        range: request.range
      }
      console.log('push Request', dbReq)
      const reqRef = yield ref.child('requests').push(dbReq)
      const reqId = reqRef.key
      const reqSN = yield reqRef.once('value')
      const savedReq = reqSN.val()
      ref.child('users').child(state.user.id).child('requests').child(reqId).set(savedReq.dateCreate)
      console.log('pushed', reqId, savedReq)
      savedReq.id = reqId
      onComplete(savedReq)
    } catch (e) {
      console.log('add Request error', e)
      onComplete()
    }
  }
}

export function cancelAppointmentFree (request, booking) {
  return function * (dispatch, getState) {
    console.log('cancelAppointmentFree', request, booking)
    const state = getState()
    try {
      yield ref.child('bookings').child(booking.id).child('dateCanceled').set(firebase.database.ServerValue.TIMESTAMP)
      yield ref.child('users')
              .child(state.user.id)
              .child('curPacks')
              .child(booking.packId)
              .child('bookings')
              .child(booking.id)
              .child('dateCanceled')
              .set(firebase.database.ServerValue.TIMESTAMP)
    } catch (e) {
      console.log('cancelAppointmentFree error', e)
    }
  }
}

export function cancelRequestFree (request) {
  return function * (dispatch, getState) {
    const state = getState()
    console.log('cancelRequestFree', request)
    ref.child('requests').child(request.id).set(null)
    ref.child('users').child(state.user.id).child('requests').child(request.id).set(null)
  }
}

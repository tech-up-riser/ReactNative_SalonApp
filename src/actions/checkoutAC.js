import { ref } from '../constants/firebase'
import { Alert } from 'react-native'
import * as _ from 'lodash'
import co from 'co'
import screens from '../constants/Screens'

const STRIPE_URL = 'https://api.stripe.com/v1/'
const SECRET = 'pk_test_rFMZtqhhT06pf5c5poe7Tg0T'

export let listeners = []

export function clearChargeListeners () {
  console.log('CLEAR CHARGE LISTENERS, length', listeners.length)
  for (let l of listeners) {
    console.log('clearListener', l)
    ref.off(l[0], l[1])
  }
  listeners = []
}

function * processCharge (dispatch, stripeData, userId, packId, navigator, onComplete) {
  const charge = {
    userId,
    packId,
    data: stripeData
  }
  console.log('processCharge', charge)
  const chargeRef = yield ref.child('charges').push(charge)
  console.log(chargeRef.key)
  const l = ref.child('charges').child(chargeRef.key).on('value', (chargeSN) => {
    const chargeRes = chargeSN.val()
    console.log('onCharge value', chargeRes)
    if (chargeRes.processed && chargeRes.processed.success) {
      onComplete()
      console.log('SUCCESSEFULY PROCESSED blowouts count', chargeRes.processed.success)
      ref.child('charges').child(chargeRef.key).off('value')
      navigator.push({
        screen: screens.PACKAGE_CONFIRMATION,
        navigatorStyle: {
          navBarHidden: true
        },
        passProps: {
          blowouts: parseInt(chargeRes.processed.success, 10)
        }
      })
    } else if (chargeRes.processed && chargeRes.processed.fail) {
      onComplete()
      ref.child('charges').child(chargeRef.key).off('value')
      Alert.alert(
        'Checkout error',
        chargeRes.processed.fail,
        [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
      )
    }
  })
  listeners.push(['value', l])
}

function reqListener (dispatch, packId, userId, navigator, onComplete) {
  return (xhr) => {
    try {
      console.log(xhr)
      console.log(xhr.target.responseText)
      const j = JSON.parse(xhr.target.responseText)
      if (xhr.target.status === 200) {
        co(processCharge(dispatch, j, userId, packId, navigator, onComplete))
      } else {
        if (j.error) {
          onComplete()
          Alert.alert(
            'Something wrong.',
            j.error.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
          )
        }
      }
    } catch (e) {
      onComplete()
      console.log(e)
    }
  }
}

function onRequestError () {
  Alert.alert(
    'Something wrong.',
    'Please, try later.',
    [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
  )
}

export function checkout (data, packId, navigator, onComplete) {
  return function * (dispatch, getState) {
    try {
      console.log('CHECKOUT', data)
      const userId = getState().user.id
      const cardNumber = _.join(_.split(data.cardNumber, ' '), '')
      const expAr = _.split(data.cardExpiryDate, '/')
      const expMonth = _.trim(expAr[0])
      const expYear = '20' + _.trim(expAr[1])
      const cvv = data.cvv
      console.log(cardNumber, expMonth, expYear)
      const formBody = []
      formBody.push(encodeURIComponent('card[number]') + '=' + encodeURIComponent(cardNumber))
      formBody.push(encodeURIComponent('card[exp_month]') + '=' + encodeURIComponent(expMonth))
      formBody.push(encodeURIComponent('card[exp_year]') + '=' + encodeURIComponent(expYear))
      formBody.push(encodeURIComponent('card[cvc]') + '=' + encodeURIComponent(cvv))
      const body = formBody.join('&')

      const oReq = new XMLHttpRequest()
      oReq.addEventListener('load', reqListener(dispatch, packId, userId, navigator, onComplete))
      oReq.addEventListener('error', onRequestError)
      oReq.open('POST', STRIPE_URL + 'tokens', true)
      oReq.setRequestHeader('Accept', 'application/json')
      oReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      oReq.setRequestHeader('Authorization', 'Bearer ' + SECRET)
      oReq.send(body)

      console.log(oReq.status, oReq.statusText, oReq.responseText)
    } catch (e) {
      console.log('checkout error')
      onComplete()
    }
  }
}

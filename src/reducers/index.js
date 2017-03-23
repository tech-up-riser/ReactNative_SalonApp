import { combineReducers } from 'redux'
import user from './User'
import forgottenEmail from './ForgottenEmail'
import searchingText from './SearchingText'
import searchBarText from './SearchBarText'
import app from './App'
import salons from './Salons'
import packs from './Packs'
import requests from './Requests'
import settings from './Settings'
import fcmToken from './FCMToken'

export default combineReducers({
  app,
  user,
  forgottenEmail,
  searchingText,
  searchBarText,
  salons,
  packs,
  requests,
  settings,
  fcmToken
})

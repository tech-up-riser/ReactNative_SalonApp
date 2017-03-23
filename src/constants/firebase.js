import firebase from 'firebase'
import { config } from '../../config'

// firebase.database.enableLogging(true, true)
firebase.initializeApp(config)

export const database = firebase.database()
export const ref = firebase.database().ref()
export const auth = firebase.auth()

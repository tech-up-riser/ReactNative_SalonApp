import { FBLoginManager } from 'react-native-facebook-login'

// Use this to call a function to log in Facebook. You can set different permissions.
exports.login = (callback) => {
  console.log(FBLoginManager)
  FBLoginManager.loginWithPermissions(['public_profile', 'email'], (error, data) => {
    if (!error) {
      console.log('Login data: ', data)
      callback(null, data)
    } else {
      console.log('Error: ', error)
      callback(error)
    }
    // result => {
    //   if (result.isCancelled) {
    //     // User cancelled login
    //     callback(null, null)
    //   } else {
    //     // User logged in successfully
    //     callback(null, result)
    //   }
    // },
    // error => callback(error)
  })
}

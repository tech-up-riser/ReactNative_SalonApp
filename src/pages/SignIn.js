import React, { Component, PropTypes } from 'react'

import {
  Image,
  StyleSheet,
  Text,
  View,
  findNodeHandle
} from 'react-native'
import InputText from '../components/Common/InputText'
import Button from '../components/Common/Button'
import { connect } from 'react-redux'
// FIXME call setForgottenEmail
import { clearForgottenEmail, setForgottenEmail } from '../actions/forgottenEmailActions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import dismissKeyboard from 'dismissKeyboard'
import Spinner from '../components/Common/Spinner'
import {
  CANT_BE_EMPTY_TEXT,
  EMAIL_REG,
  PASSWORD_LENGTH_MIN,
  EMAIL_INVALID_TEXT,
  PASSWORD_MIN_LENGTH_TEXT
} from '../constants'
import Colors from '../constants/Colors'
import { processSignIn, sendPasswordResetEmail } from '../actions/authAC'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT,
  FREE_HEIGHT
} from '../constants'
import * as navState from '../constants/NavState'
import { changeAppRoot } from '../actions/initAC'
import { getFontSize } from '../utils/DynamicSize'
import screens from '../constants/Screens'

class SignIn extends Component {

  constructor (props) {
    super(props)
    this.state = {
      emailValidationError: '',
      passwordValidationError: '',
      isValid: false,
      isLoading: false
    }
    this.email = ''
    this.password = ''
    this.emailValidationError = ''
    this.passwordValidationError = ''

    // TEMP HARDCODE
    // this.email = 'bardiaswift@outlook.com'
    // this.password = 'zzzzzz'
    // this.state = {
    //   emailValidationError: '',
    //   passwordValidationError: '',
    //   isValid: true,
    //   isLoading: false
    // }

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    props.navigator.setButtons({
      // leftButtons: [
      //   {
      //     title: 'back', // for a textual button, provide the button title (label)
      //     id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      //     disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      //     icon: require('../assets/images/Back.png')
      //   }
      // ], // see "Adding buttons to the navigator" below for format (optional)
      animated: true // does the change have transition animation or does it happen immediately (optional)
    })
  }

  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'back') { // this is the same id field from the static navigatorButtons definition
        this.props.dispatch(changeAppRoot(navState.NAV_ROOT_WALKTHROUGH))
      }
    }
  }

  _scrollToInput (event) {
    let node = findNodeHandle(event.target)
    let extraHeight = 136
    this.refs.scrollView.scrollToFocusedInput(node, extraHeight)
  }

  onEmailChange (email) {
    this.email = email
    this.props.dispatch(clearForgottenEmail())
    if (this.needValidateEmail) {
      this.validateEmail()
    }
    this.updateState()
  }

  onPasswordChange (password) {
    this.password = password
    if (this.needValidatePassword) {
      this.validatePassword()
    }
    this.updateState()
  }

  onEmailEndEditing () {
    this.needValidateEmail = true
    this.currentInput = null
    this.validateEmail()
    this.updateState()
  }

  onPasswordEndEditing () {
    this.needValidatePassword = true
    this.currentInput = null
    this.validatePassword()
    this.updateState()
  }

  validateEmail () {
    if (this.email.trim().length === 0) {
      this.emailValidationError = 'Email ' + CANT_BE_EMPTY_TEXT
      return
    }
    if (!EMAIL_REG.test(this.email)) {
      this.emailValidationError = EMAIL_INVALID_TEXT
      return
    }
    this.emailValidationError = ''
  }

  emailIsValid () {
    this.validateEmail()
    return this.emailValidationError === ''
  }

  validatePassword () {
    let length = this.password.length
    if (length === 0) {
      this.passwordValidationError = 'Password ' + CANT_BE_EMPTY_TEXT
      return
    }
    if (length < PASSWORD_LENGTH_MIN) {
      this.passwordValidationError = PASSWORD_MIN_LENGTH_TEXT
      return
    }
    this.passwordValidationError = ''
  }

  updateState () {
    this.setState({
      isValid: EMAIL_REG.test(this.email) && this.password.length >= PASSWORD_LENGTH_MIN
    })
  }

  _renderValidationErrorIfNeed (text) {
    if (text !== '') {
      return <Text style={styles.validationError}>{text}</Text>
    }
  }

  forgotPassword () {
    console.log('FORGOT PASSWORD pressed')
    const emailIsValid = this.emailIsValid()
    console.log('email is valid', emailIsValid)
    if (emailIsValid) {
      // this.setState({
      //   isLoading: true
      // })
      this.showSpinnerLightbox()
      this.props.dispatch(sendPasswordResetEmail(this.email, () => {
        this.hideSpinnerLightBox()
        // this.setState({
        //   isLoading: false
        // })
      }))
    }
  }

  signUp () {
    this.props.dispatch(changeAppRoot(navState.NAV_ROOT_SIGN_UP))
  }

  _validateAndScrollToErrorIfNeed (event) {
    this.needValidateEmail = true
    this.needValidatePassword = true
    this.validateEmail()
    this.validatePassword()
    this.updateState()
    if (this.currentInput && ((this.currentInput === this.emailInput && this.emailValidationError.length) || (this.currentInput === this.passwordInput && this.passwordValidationError.length))) {
      return
    }
    if (this.emailValidationError.length) {
      this.emailInput.focus()
      return
    }
    this.passwordInput.focus()
  }

  onComplete () {
    console.log('signIn onComplete, set isLoading false')
    this.hideSpinnerLightBox()
    // this.setState({
    //   isLoading: false
    // })
  }

  showSpinnerLightbox () {
    this.props.navigator.showLightBox({
      screen: screens.SIMPLE_SPINNER, // unique ID registered with Navigation.registerScreen
      style: {
        backgroundBlur: 'none', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
        backgroundColor: '#22222280' // tint color for the background, you can specify alpha here (optional)
      }
    })
  }

  hideSpinnerLightBox () {
    this.props.navigator.dismissLightBox()
  }

  signIn () {
    dismissKeyboard()
    this.props.dispatch(clearForgottenEmail())
    //this.setState({isLoading: true})
    this.showSpinnerLightbox()
    this.props.dispatch(processSignIn(this.email, this.password, this.onComplete.bind(this)))
  }

  submit () {
    if (this.state.isValid) {
      this.signIn()
    } else {
      this._validateAndScrollToErrorIfNeed()
    }
  }

  render () {
    const { isValid, isLoading } = this.state
    const { forgottenEmail } = this.props
    if (forgottenEmail) {
      this.email = forgottenEmail
      this.emailValidationError = ''
    }
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>


        <KeyboardAwareScrollView
          ref='scrollView'
          blockContentInset
          // style={styles.scrollViewContentContainer}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <View style={styles.signInContainer}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            </View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{'SIGN IN'}</Text>
            </View>
            <View style={styles.bottom}>
              <InputText
                setInput={this.onEmailChange.bind(this)}
                setInputOnEnd={this.onEmailEndEditing.bind(this)}
                label={'EMAIL'}
                placeholder={'your email'}
                keyboardType={'email-address'}
                ref={(r) => {
                  this.emailInput = r
                  return
                }}
                onFocus={(event) => this._scrollToInput.bind(this)(event)}
                returnKeyType={'next'}
                onSubmitEditing={(event) => { this.passwordInput.focus() }}
                value={this.email}
              />
              {this._renderValidationErrorIfNeed(this.emailValidationError)}
              <View style={styles.spaceView} />
              <InputText
                setInput={this.onPasswordChange.bind(this)}
                setInputOnEnd={this.onPasswordEndEditing.bind(this)}
                label={'PASSWORD'}
                placeholder={'your password'}
                secureTextEntry
                ref={(r) => {
                  this.passwordInput = r
                  return
                }}
                onFocus={(event) => this._scrollToInput.bind(this)(event)}
                onSubmitEditing={(event) => { this.submit() }}
                defaultValue={this.password}
              />
              {this._renderValidationErrorIfNeed(this.passwordValidationError)}
            </View>
          </View>
          <View style={styles.helperButtonsContainer}>
            <Button
              label={'FORGOT PASSWORD?'}
              color={'#666666'}
              fontSize={getFontSize(12)}
              fontWeight={'500'}
              handleOnPress={() => this.forgotPassword()}
            />
            <Button
              label={'SIGN UP'}
              color={'#8BAFBA'}
              fontSize={getFontSize(12)}
              handleOnPress={this.signUp.bind(this)}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          type={'fullWidth'}
          label={'SIGN IN'}
          backgroundColor={isValid ? '#72BED5' : Colors.DISABLED_BUTTON}
          handleOnPress={this.submit.bind(this)}
          fontSize={getFontSize(14)}
        />
        {/* <Spinner visible={isLoading} /> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  signInContainer: {
    flex: 10
  },
  logoContainer: {
    flex: 1.8,
    justifyContent: 'flex-end'
  },
  logo: {
    resizeMode: 'contain',
    // width: VIEWPORT.width * 0.7,
    alignSelf: 'center'
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  headerText: {
    alignSelf: 'center',
    fontSize: getFontSize(15),
    letterSpacing: 1.04,
    color: '#333333',
    marginBottom: 0,
    letterSpacing: 9,
    fontFamily: 'Futura',
  },
  bottom: {
    marginHorizontal: VIEWPORT.width * 0.08,
    flex: 2.2
  },
  spaceView: {
    height: VIEWPORT.height * 0.03
  },
  helperButtonsContainer: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: VIEWPORT.width * 0.9
  },
  validationError: {
    color: 'red'
  },
  scrollViewContentContainer: {
    flexDirection: 'column',
    height: FREE_HEIGHT + NAVIGATOR_HEIGHT
  }
})

SignIn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  forgottenEmail: PropTypes.string,
  navigator: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  forgottenEmail: state.forgottenEmail
})

export default connect(mapStateToProps)(SignIn)

import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Alert,
  findNodeHandle,
  Image,
  TouchableOpacity
} from 'react-native'
import InputText from '../components/Common/InputText'
import Button from '../components/Common/Button'
import FbButton from '../components/Common/FbButton'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CANT_BE_EMPTY_TEXT, EMAIL_REG, PASSWORD_LENGTH_MIN, EMAIL_INVALID_TEXT, PASSWORD_MIN_LENGTH_TEXT } from '../constants'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT,
  FREE_HEIGHT
} from '../constants'
import Colors from '../constants/Colors'
import { trimNoDigits } from '../components/Helpers'
import Spinner from '../components/Common/Spinner'
import { signUp, processFacebookSignIn } from '../actions/authAC'
import * as navState from '../constants/NavState'
import { changeAppRoot } from '../actions/initAC'
import { getFontSize } from '../utils/DynamicSize'

const phoneLengthMax = 12

class SignUp extends Component {

  constructor (props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: '',
      phone: '',
      keyboardHeight: 0,
      nameValidationError: '',
      emailValidationError: '',
      passwordValidationError: '',
      phoneValidationError: '',
      promoCode: '',
      promoInputVisible: false,
      isLoading: false
    }

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

  signInPressed () {
    this.props.dispatch(changeAppRoot(navState.NAV_ROOT_SIGN_IN))
  }

  onNavigatorEvent (event) {
    if (event.type === 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id === 'back') { // this is the same id field from the static navigatorButtons definition
        this.props.dispatch(changeAppRoot(navState.NAV_ROOT_SIGN_IN))
      }
    }
  }

  setInputs (type) {
    return (text) => {
      this.setState({
        [type]: text
      })
    }
  }

  onNameChange (name) {
    let state = {name: name}
    if (this.needValidateName || (this.needValidateEmail && this.needValidatePassword && this.needValidatePhone)) {
      let nameValidationError = ''
      if (name.trim().length === 0) {
        nameValidationError = CANT_BE_EMPTY_TEXT + ' name'
      }
      if (this.needValidateName) {
        state.nameValidationError = nameValidationError
      }
      if (nameValidationError === '') {
        this.needValidateName = true
      }
    }
    this.setState(state)
  }

  onEmailChange (email) {
    let state = {email: email}
    if (this.needValidateEmail || (this.needValidateName && this.needValidatePassword && this.needValidatePhone)) {
      let emailValidationError = ''
      if (email.trim().length === 0) {
        emailValidationError = CANT_BE_EMPTY_TEXT + ' email '
      } else if (!EMAIL_REG.test(email)) {
        emailValidationError = EMAIL_INVALID_TEXT
      }
      if (this.needValidateEmail) {
        state.emailValidationError = emailValidationError
      }
      if (emailValidationError === '') {
        this.needValidateEmail = true
      }
    }
    this.setState(state)
  }

  onPasswordChange (password) {
    let state = {password: password}
    if (this.needValidatePassword || (this.needValidateName && this.needValidateEmail && this.needValidatePhone)) {
      let passwordValidationError = ''
      let length = password.trim().length
      if (length === 0) {
        passwordValidationError = CANT_BE_EMPTY_TEXT + ' password '
      } else if (length < PASSWORD_LENGTH_MIN) {
        passwordValidationError = PASSWORD_MIN_LENGTH_TEXT
      }
      if (this.needValidatePassword) {
        state.passwordValidationError = passwordValidationError
      }
      if (passwordValidationError === '') {
        this.needValidatePassword = true
      }
    }
    this.setState(state)
  }

  onPhoneChange (phone) {
    phone = trimNoDigits(phone)
    var matches = phone.match(/\d{3,10}/g)
    var match = matches && matches[0] || ''
    var parts = []
    let i = 0
    while (i < match.length) {
      let length = i < 6 ? 3 : 4
      parts.push(match.substring(i, i + length))
      i += length
    }
    if (parts.length) {
      phone = parts.join(' ')
    }

    let state = {phone: phone}
    if (this.needValidatePhone || (this.needValidateName && this.needValidateEmail && this.needValidatePassword)) {
      let phoneValidationError = ''
      if (phone.length === 0) {
        phoneValidationError = CANT_BE_EMPTY_TEXT + 'phone number '
      } else if (phone.length < phoneLengthMax) {
        phoneValidationError = 'Phone number is invalid'
      }
      if (this.needValidatePhone) {
        state.phoneValidationError = phoneValidationError
      }
      if (phoneValidationError === '') {
        this.needValidatePhone = true
      }
    }
    this.setState(state)
  }

  onNameEndEditing () {
    this.needValidateName = true
    this.onNameChange(this.state.name)
    this.currentInput = null
  }

  onEmailEndEditing () {
    this.needValidateEmail = true
    this.onEmailChange(this.state.email)
    this.currentInput = null
  }

  onPasswordEndEditing () {
    this.needValidatePassword = true
    this.onPasswordChange(this.state.password)
    this.currentInput = null
  }

  onPhoneEndEditing () {
    this.needValidatePhone = true
    this.onPhoneChange(this.state.phone)
    this.currentInput = null
  }

  _scrollToInput (event) {
    let node = findNodeHandle(event.target)
    let extraHeight = 136
    this.refs.scrollView.scrollToFocusedInput(node, extraHeight)
  }

  _validateAndScrollToErrorIfNeed (event) {
    this.needValidateName = true
    this.needValidateEmail = true
    this.needValidatePassword = true
    this.needValidatePhone = true
    this.onNameChange(this.state.name)
    this.onEmailChange(this.state.email)
    this.onPasswordChange(this.state.password)
    this.onPhoneChange(this.state.phone)
    const { nameValidationError, emailValidationError, passwordValidationError, phoneValidationError } = this.state
    if (this.currentInput && (this.currentInput === this.nameInput && nameValidationError.length) || (this.currentInput === this.emailInput && emailValidationError.length) || (this.currentInput === this.passwordInput && passwordValidationError.length) || (this.currentInput === this.phoneInput && phoneValidationError.length)) {
      return
    }
    if (nameValidationError.length) {
      this.nameInput.focus()
      return
    }
    if (emailValidationError.length) {
      this.emailInput.focus()
      return
    }
    if (passwordValidationError.length) {
      this.passwordInput.focus()
      return
    }
    this.phoneInput.focus()
  }

  onComplete () {
    console.log('signIn onComplete, set isLoading false')
      if (this.isMounted()) {
      this.setState({
        isLoading: false
      })
    }
  }

  connectWithFacebookCallback (error, result) {
    console.log(error, result)
    if (error) {
      Alert.alert('' + error)
    } else {
      if (result) {
        console.log('authorized with FB', result)
        this.setState({ isLoading: true })
        this.props.dispatch(processFacebookSignIn(result, this.onComplete.bind(this)))
      }
    }
  }

  signUp () {
    this.setState({ isLoading: true })
    const { name, email, password, phone } = this.state
    this.props.dispatch(signUp(name, email, password, phone, this.onComplete.bind(this)))
  }

  _renderValidationErrorIfNeed (text) {
    if (text !== '') {
      return <Text style={styles.validationError}>{text}</Text>
    }
  }

  _renderSignUpButton () {
    const { nameValidationError, emailValidationError, passwordValidationError, phoneValidationError } = this.state
    let backgroundColor
    let handler
    if (this.needValidateName && this.needValidateEmail && this.needValidatePassword && this.needValidatePhone && nameValidationError === '' && emailValidationError === '' && passwordValidationError === '' && phoneValidationError === '') {
      backgroundColor = '#EAA0B3'
      handler = () => this.signUp()
    } else {
      backgroundColor = Colors.DISABLED_BUTTON
      handler = this._validateAndScrollToErrorIfNeed.bind(this)
    }
    return (
      <Button
        type={'fullWidth'}
        label={'CREATE ACCOUNT'}
        backgroundColor={backgroundColor}
        color={'#FFFFFF'}
        handleOnPress={handler}
        fontSize={getFontSize(14)}
      />
    )
  }

  togglePromo () {
    this.setState({ promoInputVisible: !this.state.promoInputVisible })
  }

  renderPromoButton () {
    return (
      <TouchableOpacity onPress={this.togglePromo.bind(this)} style={styles.promoContainer}>
        <Image source={require('../assets/images/promo-icon.png')} style={styles.promoIcon}/>
        <Text style={styles.promoText}>ENTER CODE</Text>
      </TouchableOpacity>
    )
  }

  renderPromoInput () {
    return (
      <View style={styles.textAndLabel}>
        {/*}<InputText
          setInput={this.onPasswordChange.bind(this)}
          label='PROMOCODE'
          placeholder='Enter promo code'
          secureTextEntry
          ref={r => this.passwordInput = r}
          onFocus={(event) => this._scrollToInput.bind(this)(event)}
          setInputOnEnd={this.onPasswordEndEditing.bind(this)}
          returnKeyType='next'
          onSubmitEditing={(event) => { this.phoneInput.focus() }}
        />
        {this._renderValidationErrorIfNeed(passwordValidationError)}
        */}
      </View>
    )
  }

  render () {
    const { phone, nameValidationError, emailValidationError, passwordValidationError, phoneValidationError, isLoading } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
        </View>


        <KeyboardAwareScrollView
          ref='scrollView'
          blockContentInset
          contentContainerStyle={styles.scrollViewContentContainer}
        >


          <View style={styles.top}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>SIGN UP</Text>
              {/* <Text style={{marginHorizontal: 15}}>or</Text>
              <TouchableOpacity onPress={this.signInPressed.bind(this)} style={styles.signInContainer}>
                <Text style={[styles.font, styles.blueFont]}>SIGN IN</Text>
              </TouchableOpacity>*/}
            </View>
            <View style={styles.fbButtonContainer}>
              <FbButton label='Connect with Facebook' color='#2C589D' callback={this.connectWithFacebookCallback.bind(this)} />
            </View>
            <View style={styles.headerTextChangeContainer}>
              <Text style={styles.headerTextChange}>or</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.textAndLabel}>
              <InputText
                setInput={this.onNameChange.bind(this)}
                label='FULL NAME'
                placeholder='your name'
                keyboardType='ascii-capable'
                ref={r => this.nameInput = r}
                onFocus={(event) => {
                  console.log('onFocus', event)
                  this._scrollToInput.bind(this)(event)
                }}
                onChangeText
                setInputOnEnd={this.onNameEndEditing.bind(this)}
                returnKeyType='next'
                onSubmitEditing={(event) => { this.emailInput.focus() }}
              />
              {this._renderValidationErrorIfNeed(nameValidationError)}
            </View>
            <View style={styles.textAndLabel}>
              <InputText
                setInput={this.onEmailChange.bind(this)}
                label='EMAIL'
                placeholder='your email'
                keyboardType='email-address'
                ref={r => this.emailInput = r}
                onFocus={(event) => this._scrollToInput.bind(this)(event)}
                setInputOnEnd={this.onEmailEndEditing.bind(this)}
                returnKeyType='next'
                onSubmitEditing={(event) => { this.passwordInput.focus() }}
              />
              {this._renderValidationErrorIfNeed(emailValidationError)}
            </View>
            <View style={styles.textAndLabel}>
              <InputText
                setInput={this.onPasswordChange.bind(this)}
                label='PASSWORD'
                placeholder='your password'
                secureTextEntry
                ref={r => this.passwordInput = r}
                onFocus={(event) => this._scrollToInput.bind(this)(event)}
                setInputOnEnd={this.onPasswordEndEditing.bind(this)}
                returnKeyType='next'
                onSubmitEditing={(event) => { this.phoneInput.focus() }}
              />
              {this._renderValidationErrorIfNeed(passwordValidationError)}
            </View>
            <View style={styles.textAndLabel}>
              <InputText
                setInput={this.onPhoneChange.bind(this)}
                label='PHONE NUMBER'
                placeholder='your phone number'
                keyboardType='numeric'
                ref={r => this.phoneInput = r}
                onFocus={(event) => this._scrollToInput.bind(this)(event)}
                setInputOnEnd={this.onPhoneEndEditing.bind(this)}
                value={phone}
                maxLength={phoneLengthMax}
              />
              {this._renderValidationErrorIfNeed(phoneValidationError || ' ')}
            </View>
          </View>

            {(this.state.promoInputVisible) ? this.renderPromoInput() : this.renderPromoButton() }


          <View style={styles.signInTextsContainer}>
            <Text style={[styles.font, styles.grayFont]}>ALREADY HAVE AN ACCOUNT?</Text>
            <TouchableOpacity onPress={this.signInPressed.bind(this)} style={styles.signInContainer}>
              <Text style={[styles.font, styles.blueFont, {marginLeft: 15}]}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        {this._renderSignUpButton()}
        <Spinner visible={isLoading} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  top: {
    alignItems: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'column',
    flex: 0.5
  },
  bottom: {
    flex: 1,
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'green',
    // backgroundColor: 'yellow'
  },
  headerTextContainer: {
    flex: 1.99,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'pink',
    // marginBottom: 35
  },
  headerText: {
    fontSize: getFontSize(15),
    letterSpacing: 1.04,
    color: '#333333',
    marginBottom: 0,
    // fontWeight: '300',
    letterSpacing: 9,

    fontFamily: 'Futura',
    // alignSelf: 'flex-end',
    // marginBottom: 25
  },
  fbButtonContainer: {
    // flex: 1,
    // height: VIEWPORT.height * 0.07,
    height: 45,
    justifyContent: 'center'
  },
  headerTextChangeContainer: {
    flex: 1.2,
    justifyContent: 'center',
    // backgroundColor: 'cyan'
  },
  headerTextChange: {
    fontSize: getFontSize(14),
    color: 'black'
  },
  textAndLabel: {
    marginLeft: 23,
    marginRight: 25,
    marginTop: 18.5
  },
  validationError: {
    color: 'red'
  },
  logoContainer: {
    height: NAVIGATOR_HEIGHT,
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: VIEWPORT.width * 0.3,
    alignSelf: 'center'
  },
  promoIcon: {
    resizeMode: 'contain',
    width: VIEWPORT.width * 0.04,
  },
  promoText: {
    fontSize: getFontSize(11),
    fontWeight: '300',
    color: '#666666',
    marginLeft: 9
  },
  scrollViewContentContainer: {
    height: FREE_HEIGHT
  },
  font: {
    fontSize: getFontSize(12),
    fontWeight: '300',
  },
  grayFont: {
    color: '#666666'
  },
  blueFont: {
    color: '#72BED5'
  },
  signInTextsContainer: {
    flex: 0,
    // paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 20,
    marginVertical: VIEWPORT.height * 0.04,
    // backgroundColor: 'orange'
  },
  signInContainer: {
    // marginLeft: 12,
    // alignSelf: 'center',
    // marginBottom: 30
  },
  promoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: VIEWPORT.height * 0.01
  }
})

SignUp.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(SignUp)

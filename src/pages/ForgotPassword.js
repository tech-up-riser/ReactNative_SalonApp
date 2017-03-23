import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native'
import { CANT_BE_EMPTY_TEXT, EMAIL_REG, EMAIL_INVALID_TEXT } from '../constants'
import Colors from '../constants/Colors'
import InputText from '../Common/InputText'
import Button from '../Common/Button'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { popScreen } from '../../actions/navActions'
import { setForgottenEmail } from '../../actions/forgottenEmailActions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from '../Common/Spinner'
import dismissKeyboard from 'dismissKeyboard'

class ForgotPassword extends Component {

  constructor () {
    super()
    this.state = {
      emailValidationError: '',
      isValid: false,
      isLoading: false
    }
    this.email = ''
    this.emailValidationError = ''

    // TEMP HARDCODE
    // this.state = {
    //   emailValidationError: '',
    //   isValid: true,
    //   isLoading: false
    // }
    // this.email = 'bardiaswift@outlook.com'
  }

  _scrollToInput (event, reactNode) {
    this.currentInput = reactNode
    let node = React.findNodeHandle(reactNode)
    let extraHeight = 138
    this.refs.scrollView.scrollToFocusedInput(event, node, extraHeight)
  }

  onEmailChange (email) {
    this.email = email
    if (this.needValidateEmail) {
      this.validateEmail()
    }
    this.updateState()
  }

  onEmailEndEditing () {
    this.needValidateEmail = true
    this.currentInput = null
    this.validateEmail()
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

  updateState () {
    this.setState({
      emailValidationError: this.emailValidationError,
      isValid: EMAIL_REG.test(this.email)
    })
  }

  _renderValidationErrorIfNeed (text) {
    if (text !== '') {
      return <Text style={styles.validationError}>{text}</Text>
    }
  }

  submit () {
    if (this.state.isValid) {
      const { firebaseRef, popScreen, setForgottenEmail } = this.props
      dismissKeyboard()
      this.setState({isLoading: true})
      firebaseRef.resetPassword({
        email: this.email
      }, (error) => {
        this.setState({isLoading: false})
        if (error === null) {
          console.log('Password reset email sent successfully')
          setForgottenEmail(this.email)
          popScreen()
        } else {
          setTimeout(() => {
            Alert.alert(error.code)
          }, 10)
        }
      })
    } else {
      this.needValidateEmail = true
      this.validateEmail()
      this.updateState()
      const { emailValidationError } = this.state
      if (this.currentInput && this.currentInput === this.emailInput && emailValidationError.length) {
        return
      }
      this.emailInput.focus()
    }
  }

  render () {
    const { emailValidationError, isValid, isLoading } = this.state
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView ref='scrollView' blockContentInset>
          <View style={styles.content}>
            <InputText
              setInput={this.onEmailChange.bind(this)}
              setInputOnEnd={this.onEmailEndEditing.bind(this)}
              label={'EMAIL'}
              placeholder={'your email'}
              keyboardType={'email-address'}
              ref={r => this.emailInput = r}
              onFocus={(event) => this._scrollToInput(event, this.emailInput)}
              onSubmitEditing={(event) => { this.submit() }}
              defaultValue={this.email}
            />
            {this._renderValidationErrorIfNeed(emailValidationError)}
          </View>
        </KeyboardAwareScrollView>
        <Button
          type={'fullWidth'}
          label={'FORGOT'}
          backgroundColor={isValid ? '#72BED5' : Colors.DISABLED_BUTTON}
          color={'#FFFFFF'}
          handleOnPress={this.submit.bind(this)}
        />
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
  content: {
    margin: 30
  },
  validationError: {
    color: 'red'
  }
})

export default connect(
  (state) => ({
    firebaseRef: state.firebaseRef
  }),
  (dispatch) => bindActionCreators({popScreen, setForgottenEmail}, dispatch)
)(ForgotPassword)

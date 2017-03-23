import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native'
import { NAVIGATOR_HEIGHT, CANT_BE_EMPTY_TEXT, PASSWORD_LENGTH_MIN, PASSWORD_MIN_LENGTH_TEXT } from '../constants'
import Colors from '../constants/Colors'
import InputText from '../Common/InputText'
import Button from '../Common/Button'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as usersActions from '../../actions/usersAction'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from '../Common/Spinner'
import dismissKeyboard from 'dismissKeyboard'

class ChangePassword extends Component {

  constructor () {
    super()
    this.oldPassword = ''
    this.newPassword = ''
    this.oldPasswordValidationError = ''
    this.newPasswordValidationError = ''
    this.state = {
      oldPasswordValidationError: '',
      newPasswordValidationError: '',
      isValid: false,
      isLoading: false
    }
  }

  _scrollToInput (event, reactNode) {
    this.currentInput = reactNode
    let node = React.findNodeHandle(reactNode)
    let extraHeight = 138
    this.refs.scrollView.scrollToFocusedInput(event, node, extraHeight)
  }

  onOldPasswordChange (oldPassword) {
    this.oldPassword = oldPassword
    if (this.needValidateOldPassword) {
      this.validateOldPassword()
    }
    this.updateState()
  }

  onNewPasswordChange (newPassword) {
    this.newPassword = newPassword
    if (this.needValidateNewPassword) {
      this.validateNewPassword()
    }
    this.updateState()
  }

  onOldPasswordEndEditing () {
    this.needValidateOldPassword = true
    this.currentInput = null
    this.validateOldPassword()
    this.updateState()
  }

  onNewPasswordEndEditing () {
    this.needValidateNewPassword = true
    this.currentInput = null
    this.validateNewPassword()
    this.updateState()
  }

  validateOldPassword () {
    let length = this.oldPassword.length
    if (length === 0) {
      this.oldPasswordValidationError = CANT_BE_EMPTY_TEXT + ' password '
      return
    }
    if (length < PASSWORD_LENGTH_MIN) {
      this.oldPasswordValidationError = PASSWORD_MIN_LENGTH_TEXT
      return
    }
    this.oldPasswordValidationError = ''
  }

  validateNewPassword () {
    let length = this.newPassword.length
    if (length === 0) {
      this.newPasswordValidationError = CANT_BE_EMPTY_TEXT + ' password '
      return
    }
    if (length < PASSWORD_LENGTH_MIN) {
      this.newPasswordValidationError = PASSWORD_MIN_LENGTH_TEXT
      return
    }
    this.newPasswordValidationError = ''
  }

  updateState () {
    this.setState({
      oldPasswordValidationError: this.oldPasswordValidationError,
      newPasswordValidationError: this.newPasswordValidationError,
      isValid: this.oldPassword.length >= PASSWORD_LENGTH_MIN && this.newPassword.length >= PASSWORD_LENGTH_MIN
    })
  }

  _renderValidationErrorIfNeed (text) {
    if (text !== '') {
      return <Text style={styles.validationError}>{text}</Text>
    }
  }

  submit () {
    if (this.state.isValid) {
      const { firebaseRef } = this.props
      dismissKeyboard()
      this.setState({isLoading: true})
      firebaseRef.changePassword({
        email: 'bardiaswift@outlook.com',
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }, (error) => {
        this.setState({isLoading: false})
        let message
        if (error === null) {
          message = 'Password changed successfully'
        } else {
          message = 'Error: ' + error['code']
        }
        console.log(message)
        setTimeout(() => {
          Alert.alert(message)
        }, 10)
      })
    } else {
      this.needValidateOldPassword = true
      this.needValidateNewPassword = true
      this.validateOldPassword()
      this.validateNewPassword()
      this.updateState()
      const { oldPasswordValidationError, newPasswordValidationError } = this.state
      if (this.currentInput && ((this.currentInput === this.oldPasswordInput && oldPasswordValidationError.length) || (this.currentInput === this.newPasswordInput && newPasswordValidationError.length))) {
        return
      }
      if (oldPasswordValidationError.length) {
        this.oldPasswordInput.focus()
        return
      }
      this.newPasswordInput.focus()
    }
  }

  render () {
    const { oldPasswordValidationError, newPasswordValidationError, isValid, isLoading } = this.state
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView ref='scrollView' blockContentInset>
          <View style={styles.content}>
            <InputText
              setInput={this.onOldPasswordChange.bind(this)}
              setInputOnEnd={this.onOldPasswordEndEditing.bind(this)}
              label={'OLD PASSWORD'}
              placeholder={'your old password'}
              ref={r => this.oldPasswordInput = r}
              onFocus={(event) => this._scrollToInput(event, this.oldPasswordInput)}
              returnKeyType='next'
              onSubmitEditing={(event) => { this.newPasswordInput.focus() }}
              secureTextEntry
            />
            {this._renderValidationErrorIfNeed(oldPasswordValidationError)}
            <View style={styles.spaceView} />
            <InputText
              setInput={this.onNewPasswordChange.bind(this)}
              setInputOnEnd={this.onNewPasswordEndEditing.bind(this)}
              label={'NEW PASSWORD'}
              placeholder={'your new password'}
              ref={r => this.newPasswordInput = r}
              onFocus={(event) => this._scrollToInput(event, this.newPasswordInput)}
              onSubmitEditing={(event) => { this.submit() }}
              secureTextEntry
            />
            {this._renderValidationErrorIfNeed(newPasswordValidationError)}
          </View>
        </KeyboardAwareScrollView>
        <Button
          type={'fullWidth'}
          label={'CHANGE'}
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
    marginTop: NAVIGATOR_HEIGHT
  },
  content: {
    paddingHorizontal: 30
  },
  validationError: {
    color: 'red'
  }, spaceView: {
    height: 18
  }
})

const mapStateToProps = state => ({
  firebaseRef: state.firebaseRef,
  user: state.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators(usersActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)

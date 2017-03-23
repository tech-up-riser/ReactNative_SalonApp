import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { VIEWPORT } from '../../constants'
import {getFontSize} from '../../utils/DynamicSize'

export default class InputText extends Component {

  focus () {
    this.refs.textInput.focus()
  }

  render () {
    const {setInput, setInputOnEnd, onFocus, value, maxLength, returnKeyType, onSubmitEditing} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {this.props.label}
        </Text>
        <View style={styles.borderBottom}>
          <TextInput
            underlineColorAndroid={'rgba(0,0,0,0)'}
            style={styles.textInput}
            onChangeText={setInput ? (text) => setInput(text) : null}
            onEndEditing={setInputOnEnd ? (e) => setInputOnEnd(this.props.index, e.nativeEvent.text) : null}
            onSubmitEditing={onSubmitEditing}
            value={value}
            maxLength={maxLength || null}
            onFocus={onFocus ? (event) => onFocus(event) : null}
            autoFocus={this.props.autoFocus}
            autoCorrect={this.props.autoCorrect}
            keyboardType={this.props.keyboardType}
            autoCapitalize={this.props.autoCapitalize}
            placeholder={this.props.placeholder}
            secureTextEntry={this.props.secureTextEntry}
            placeholderTextColor='#9B9B9B'
            returnKeyType={returnKeyType || 'default'}
            ref='textInput'
            defaultValue={this.props.defaultValue}
          />
        </View>
      </View>
    )
  }
}

InputText.defaultProps = {
  secureTextEntry: false,
  placeholder: 'Your Text',
  keyboardType: 'default',
  autoCapitalize: 'none',
  autoCorrect: false,
  autoFocus: false,
  label: 'YOUR TEXT'
}

InputText.propTypes = {
  secureTextEntry: PropTypes.bool,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.oneOf([
    'default',
    'email-address',
    'numeric',
    'phone-pad',
    'ascii-capable',
    'numbers-and-punctuation',
    'url',
    'number-pad',
    'name-phone-pad',
    'decimal-pad',
    'twitter',
    'web-search'
  ]),
  autoCapitalize: PropTypes.oneOf([
    'none',
    'sentences',
    'words',
    'characters'
  ]),
  autoCorrect: PropTypes.bool,
  autoFocus: PropTypes.bool,
  setInput: PropTypes.func,
  setInputOnEnd: PropTypes.func,
  label: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
  },
  label: {
    fontSize: getFontSize(12),
    letterSpacing: 0.9,
    color: '#929292'
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29, 29, 38, 0.1)'
  },
  textInput: {
    //height: 41,
    height: VIEWPORT.height * 0.055,
    paddingLeft: 0,
    width: 0.85 * VIEWPORT.width, // 85% of device width
    color: '#1D1D26',
    fontSize: getFontSize(14)
  }
})

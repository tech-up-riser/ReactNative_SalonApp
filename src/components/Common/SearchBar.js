import React, { Component, PropTypes } from 'react'
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    View
} from 'react-native'
import { VIEWPORT } from '../constants'

export default class SearchBarOnMap extends Component {

    constructor (props) {
      super(props)
      this.state = {
        textValue: ''
      }
    }

    updateText (text) {
      this.setState({textValue: text})
    }

    clearText () {
      this.setState({textValue: ''})
      console.log(this.props)
    }
    searchByText () {
      this.setState({textValue: ''})
      console.log(this.props)
    }

    render () {
        const {setInput, setInputOnEnd} = this.props
        let buttonClear = this.state.textValue.length > 0 ?
            (<TouchableOpacity
              activeOpacity={0.6}
              onPress={this.searchByText.bind(this)}>
                <Image source={require('../../assets/images/clear-button.png')}/>
            </TouchableOpacity>)
            : null

      return (
          <View style={styles.container}>
              <View style={styles.borderBottom}>
                  <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={this.clearText.bind(this)}>
                      <Image source={require('../../assets/images/search-icon.png')} />
                  </TouchableOpacity>
                  <TextInput
                      style={styles.textInput}
                      value={this.state.textValue}
                      // onChangeText={setInput ? (text) => {this.updateText.bind(this); setInput(text);} : null}
                      onChangeText={this.updateText.bind(this)}
                      // onEndEditing={setInputOnEnd ? (e) => setInputOnEnd(this.props.index, e.nativeEvent.text) : null}
                      controlled={true}
                      autoFocus={this.props.autoFocus}
                      autoCorrect={this.props.autoCorrect}
                      keyboardType={this.props.keyboardType}
                      autoCapitalize={this.props.autoCapitalize}
                      placeholder={this.props.placeholder}
                      secureTextEntry={this.props.secureTextEntry}
                      placeholderTextColor='#9B9B9B'
                      />
                  {buttonClear}
              </View>
          </View>
        )
    }
}

SearchBarOnMap.defaultProps = {
  secureTextEntry: false,
  placeholder: 'Your Text',
  keyboardType: 'default',
  autoCapitalize: 'none',
  autoCorrect: false,
  autoFocus: false
}

SearchBarOnMap.propTypes = {
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
  setInputOnEnd: PropTypes.func
}

const styles = StyleSheet.create({
  container: {},

  borderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(29, 29, 38, 0.1)'
  },
  textInput: {
    height: 41,
    width: 0.45 * VIEWPORT.width, // 85% of device width
    color: '#1D1D26',
    fontSize: 18,
    marginLeft: 5
    // marginRight:5
  }
})

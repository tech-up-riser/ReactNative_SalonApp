import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Image,
  Keyboard,
  View
} from 'react-native'
import { SUBMIT_BUTTON_HEIGHT, VIEWPORT } from '../../constants'

export default class Button extends Component {

  constructor () {
    super()
    this.state = {
      keyboardHeight: 0
    }
  }

  componentDidMount () {
    if (this.props.keyboadAvoiding) {
      this.keyboardWillShowEvent = Keyboard.addListener('keyboardWillShow', this.updateKeyboardHeight.bind(this))
      this.keyboardWillHideEvent = Keyboard.addListener('keyboardWillHide', this.resetKeyboardHeight.bind(this))
    }
  }

  componentWillUnmount () {
    if (this.props.keyboadAvoiding) {
      this.keyboardWillShowEvent.remove()
      this.keyboardWillHideEvent.remove()
    }
  }

  updateKeyboardHeight (frames) {
    if (this.props.keyboadAvoiding) {
      LayoutAnimation.easeInEaseOut()
      this.setState({keyboardHeight: frames.endCoordinates.height})
    }
  }

  resetKeyboardHeight () {
    if (this.props.keyboadAvoiding) {
      LayoutAnimation.easeInEaseOut()
      this.setState({keyboardHeight: 0})
    }
  }

  _renderArrowIfNeed () {
    if (this.props.withArrow) {
      return (
        <View style={styles.arrowContainer}>
          <Image source={require('../../assets/images/right-caret.png')} style={styles.arrow} />
        </View>
      )
    }
  }

  render () {
    const {color, fontSize, handleOnPress, fontWeight, keyboadAvoiding} = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleOnPress}
        style={[
          styles.container,
          this.props.type === 'fullWidth' && styles.fullWidthContainer,
          this.props.type === 'fullWidth' && {backgroundColor: this.props.backgroundColor},
          {marginBottom: keyboadAvoiding ? this.state.keyboardHeight : 0}
        ]}
      >
        <Text style={[
          styles.text,
          {color: color, fontSize: fontSize, fontWeight: fontWeight}
          //this.props.type === 'fullWidth' && {fontSize: 14}
        ]}>
          {this.props.label}
        </Text>
        {this._renderArrowIfNeed()}
      </TouchableOpacity>
    )
  }
}

// PropTypes and default props
Button.defaultProps = {
  color: 'white',
  fontSize: 12,
  backgroundColor: '#00D1C1',
  fontWeight: '600',
  withArrow: false,
  keyboadAvoiding: true
}

Button.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.string,
  type: PropTypes.string,
  handleOnPress: PropTypes.func.isRequired,
  withArrow: PropTypes.bool,
  keyboadAvoiding: PropTypes.bool
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    zIndex: 5
  },
  fullWidthContainer: {
    left: 0,
    right: 0,
    height: SUBMIT_BUTTON_HEIGHT,
    backgroundColor: '#00D1C1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#107A86'
  },
  arrowContainer: {
    position: 'absolute',
    right: VIEWPORT.width * 0.04,
    top: 0,
    height: SUBMIT_BUTTON_HEIGHT,
    justifyContent: 'center'

  },
  arrow: {
    height: SUBMIT_BUTTON_HEIGHT / 2.2,
    resizeMode: 'contain'
  }
})

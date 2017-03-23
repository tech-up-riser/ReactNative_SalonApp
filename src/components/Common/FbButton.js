import React, { Component, PropTypes } from 'react'

import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View
} from 'react-native'
import { VIEWPORT } from '../../constants'
import * as FacebookSDK from '../../utils/FacebookSDK'
import { getFontSize } from '../../utils/DynamicSize'

export default class FbButton extends Component {
  onPress () {
    const { onPress, callback } = this.props
    if (onPress) {
      onPress()
    }
    FacebookSDK.login((error, result) => {
      callback(error, result)
    })
  }

  render () {
    const {color, fontSize} = this.props
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={this.onPress.bind(this)}
        style={[styles.buttonFB, { backgroundColor: this.props.backgroundColor }]}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} resizeMode={'contain'} source={require('../../assets/images/FB-logo.png')} />
          </View>
          <Text style={[styles.headerTextFB, {color: color}]}>{this.props.label}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

// PropTypes and default props
FbButton.defaultProps = {
  color: '#000',
  fontSize: getFontSize(14),
  backgroundColor: '#FFF'
}

FbButton.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.number,
  callback: PropTypes.func.isRequired,
  onPress: PropTypes.func
}

const styles = StyleSheet.create({
  text: {
    color: '#107A86',
    fontSize: getFontSize(12)
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#2C589D',
    borderWidth: 1,
    borderRadius: 4,
    width: VIEWPORT.width / 1.5,
    height: VIEWPORT.height * 0.06
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: VIEWPORT.width * 0.12,
    height: VIEWPORT.height * 0.06
  },
  logo: {
    height: VIEWPORT.height * 0.032,
    resizeMode: 'contain'
  },
  headerTextFB: {
    fontSize: getFontSize(14),
    color: '#2C589D'
  }
})

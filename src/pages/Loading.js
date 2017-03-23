import {
  StyleSheet,
  View,
  Image
} from 'react-native'
import React, { Component } from 'react'

import { VIEWPORT } from '../constants'

const margin = 10

export default class Loading extends Component {

  render () {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/launch-image.png')}
          style={styles.logo} />
      </View>
    )
  }

}

Loading.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: VIEWPORT.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    // width: Math.min(VIEWPORT.width - margin, 1170),
    // height: Math.min(VIEWPORT.height - margin, 232),
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    resizeMode: 'cover'
  }
})

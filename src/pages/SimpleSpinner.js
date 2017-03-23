import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native'

export default class SimpleSpinner extends Component {

  render () {
    return (
      <View style={styles.spinnerView}>
        <ActivityIndicator
          animating={true}
          size={'large'}
          {...this.props}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  spinnerView: {
    flex: 1,
//    backgroundColor: 'black',
//    opacity: 0.5,
    justifyContent: 'center'
  }
})

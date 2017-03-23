import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ProgressBarAndroid,
  Platform,
  Modal
} from 'react-native'

export default class Spinner extends Component {

  _renderSpinner() {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
          style={{height: 20}}
          styleAttr="Inverse"
          {...this.props}
        />
      )
    } else {
      return (
        <ActivityIndicator
          animating={true}
          size="large"
          {...this.props}
        />
      )
    }
  }

  render () {
    return (
      <Modal transparent visible={this.props.visible}>
        <View style={styles.spinnerView}>
          {this._renderSpinner()}
        </View>
      </Modal>
    )
  }
}

Spinner.propTypes = {
  visible: PropTypes.bool.isRequired
}

const styles = StyleSheet.create({
  spinnerView: {
    flex: 1,
    backgroundColor: 'black',
    opacity: 0.5,
    justifyContent: 'center'
  }
})

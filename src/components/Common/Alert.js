import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TextInput,
  TouchableHighlight
} from 'react-native'
import Dimensions from 'Dimensions'

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height

export default class Alert extends Component {

  constructor () {
    super()

    let width
    let height
    if (WINDOW_WIDTH < WINDOW_HEIGHT) {
      width = WINDOW_WIDTH - 32
      height = width / 16 * 9
    } else {
      height = WINDOW_HEIGHT - 32
      width = height / 9 * 16
    }

    this.state = {
      width: width,
      height: height
    }
  }

  render () {
    const { width, height } = this.state
    const { visible, title, message, placeholder } = this.props
    return (
      <Modal transparent visible={visible}>
        <View style={styles.background}>
          <View style={[styles.alert, {width: width, height: height}]}>
            <Text style={styles.title}>{title}</Text>
            <Text>{message}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              keyboardType='email-address'
            />
            <View style={styles.buttonsContainer}>
              <TouchableHighlight>
                <Text>Send</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

Alert.defaultProps = {
  visible: true,
  title: '',
  message: '',
  placeholder: ''
}

Alert.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  placeholder: PropTypes.string
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert: {
    backgroundColor: 'white',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  },
  input: {
    height: 40,
    fontSize: 14
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignSelf: 'flex-end'
  }
})

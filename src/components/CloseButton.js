import React, { Component, PropTypes } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default class CloseButton extends Component {

  render () {
    return (
      <TouchableOpacity onPress={this.props.onClick} style={styles.container}>
        <Icon
          name={'ios-close'}
          size={40}
          color={'#666'}
          backgroundColor={'transparent'}
          style={styles.img}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    marginLeft: 15,
    marginRight: 10
  }
})

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

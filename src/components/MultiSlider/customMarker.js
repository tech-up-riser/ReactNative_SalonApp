import { StyleSheet, Image } from 'react-native'
import React, {Component, PropTypes} from 'react'

 export default class CustomMarker extends Component {
  render () {
    return (
      <Image
        style={styles.image}
        source={this.props.pressed ? require('./ruby.png') : require('./diamond.png')}
        resizeMode='contain'
      />
    )
  }
}

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40
  }
})


CustomMarker.propTypes = {
  pressed: PropTypes.bool
}

import React, {
  Component, PropTypes
} from 'react'

import Icon from 'react-native-vector-icons/Entypo'

export default class Chevron extends Component {

  render () {
    const {
      color,
      size,
      handleOnPress
    } = this.props
    return (
      <Icon name='chevron-thin-right' size={size} color={color} onPress={handleOnPress} />
    )
  }
}

Chevron.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  handleOnPress: PropTypes.func
}

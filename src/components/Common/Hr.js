import React, { Component, PropTypes } from 'react'
import { StyleSheet, View } from 'react-native'
// specify horizontal line with percentage
// eg: <Hr width=80 /> will be a hr line with 80% width
export default class Hr extends Component {
  render () {
    // percent to flex conversion
    const { widthPercent, color, height } = this.props
    const spacerFlex = (100 - widthPercent) / 20
    const hrFlex = widthPercent / 10

    return (
      <View style={styles.container}>
        <View style={{flex: spacerFlex}} />
        <View style={{height: height, backgroundColor: color, flex: hrFlex}} />
        <View style={{flex: spacerFlex}} />
      </View>
    )
  }
}

// proptypes and default props
Hr.defaultProps = {
  widthPercent: 85,
  color: 'green',
  height: 1
}

Hr.propTypes = {
  widthPercent: PropTypes.number,
  color: PropTypes.string,
  height: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 1,
    justifyContent: 'center'
  },
  hr: {
    backgroundColor: 'red'
  }
})

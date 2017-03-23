import React, { Component, PropTypes } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import { dynamicSize } from '../../utils/DynamicSize'

export default class ScoreLabel extends Component {

  render () {
    let hours24 = Math.floor(this.props.value)
    let hours12 = hours24 >= 12 ? hours24 - 12 : hours24
    let ampm = hours24 < 12 ? 'AM' : 'PM'
    let minutes = Math.ceil((this.props.value - Math.floor(this.props.value)) * 60)
    minutes = Math.round(minutes / 10) * 10
    if (hours12 === 0) hours12 = 12
    let score = hours12 + ':' + ((minutes < 10 ? '0' : '') + minutes).toString()


    return (
        <View style={styles.container}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.score}>{ampm}</Text>
        </View>
    )
  }

}

ScoreLabel.propTypes = {
  value: PropTypes.number
}

ScoreLabel.defaultProps = {
  value: 0
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    color: '#333333',
    fontSize: dynamicSize(12)
  }
})

import React, { PropTypes } from 'react'
import {
    StyleSheet,
    View,
    Image
} from 'react-native'

import ScoreLabel from './ScoreLabel'
import { dynamicSize } from '../../utils/DynamicSize'

const CustomMarker = ({values, num}) => {
//  console.log('custom marker', values, num)
  const value = values[num]
  let margin = 0
  const kmargin = 2
  if (values.length > 1) {
    const dx = values[1] - values[0]
    if (dx < kmargin) {
      margin = (1 - dx / kmargin) * dynamicSize(35)
    }
  }
  let marginStyle = { marginRight: margin }
  if (num !== 0) marginStyle = { marginLeft: margin }
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/images/SlidersMarker.png')} resizeMode='contain'/>
      <View style={marginStyle}>
        <ScoreLabel value={value} num={num}/>
      </View>
    </View>
  )
}

ScoreLabel.propTypes = {
  value: PropTypes.number
}

ScoreLabel.defaultProps = {
  value: 0
}

var styles = StyleSheet.create({
  container: {
    height: dynamicSize(25),
    width: dynamicSize(70),
    alignItems: 'center'
  },
  image: {
    height: dynamicSize(25),
    width: dynamicSize(25)
  },
  score: {
    lineHeight: 15,
    textAlign: 'center'
  }
})

module.exports = CustomMarker

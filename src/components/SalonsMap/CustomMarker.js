import React, { PropTypes } from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text
} from 'react-native'

import { getFontSize, dynamicSize } from '../../utils/DynamicSize'

const CustomMarker = ({values, num}) => {
//  console.log('custom marker', values, num)
  const value = values[num]
  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>{value + ' mi'}</Text>
      {/* <Image style={styles.image} source={require('../../assets/images/SlidersMarker.png')} resizeMode='contain'/> */}
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    height: dynamicSize(30),
    width: dynamicSize(64),
    backgroundColor: '#5B5D68',
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center'
  },
  image: {
    height: dynamicSize(25),
    width: dynamicSize(25)
  },
  score: {
    lineHeight: 15,
    textAlign: 'center'
  },
  scoreText: {
    fontSize: getFontSize(16),
    color: '#FFFFFF',
    fontWeight: '500'
  }
})

module.exports = CustomMarker

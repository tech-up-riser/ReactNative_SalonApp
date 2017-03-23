import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { VIEWPORT, FREE_HEIGHT } from '../../constants'
import Colors from '../../constants/Colors'
import { getFontSize } from '../../utils/DynamicSize'
import Button from '../Common/Button'

export default class Boarding extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Image style={styles.image} resizeMode={'cover'} source={this.props.imageSource}/>
        <View />
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>{this.props.headText}</Text>
          <Text style={styles.subHeadingText}>{this.props.subHeadText}</Text>
        </View>
        <TouchableOpacity onPress={this.props.toNext} style={styles.skipContainer}>
          <Text style={[styles.font, styles.grayFont]}>SKIP</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
// <View style={styles.buttonContainer}>
//   <Button
//     type={'fullWidth'}
//     label={'NEXT'}
//     backgroundColor={'#5B5D68'}
//     handleOnPress={this.props.onSignUpPress}
//     fontSize={getFontSize(14)}
//     />
// </View>
const styles = StyleSheet.create({
  container: {
    // free place - BottomContainer height
    // height: FREE_HEIGHT - VIEWPORT.height * 0.15
    // height: FREE_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: VIEWPORT.height * 0.1,
    flex: 1
  },
  buttonContainer: {
    height: VIEWPORT.height * 0.15,
    width: VIEWPORT.width,
    backgroundColor: 'yellow'
    // right: 0,
    // zIndex: 99,
  },
  font: {
    fontSize: getFontSize(12),
    fontWeight: '400'
  },
  grayFont: {
    color: '#666666'
  },
  skipContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'white',
    marginRight: VIEWPORT.width * 0.06,
    marginBottom: VIEWPORT.height * 0.02,
    zIndex: 3999,
    // backgroundColor: '#CCC'
  //  width: 40
  },
  onBoarding: {
    height: VIEWPORT.height * 0.45,
    // height: FREE_HEIGHT,
    backgroundColor: '#8F92A3',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: VIEWPORT.width,
    height: VIEWPORT.height
  },
  textContainer: {
    // flex: 1,
    justifyContent: 'center',
    marginHorizontal: 36,
    marginTop: 130,
    // zIndex: 999999
  },
  headingText: {
    // color: Colors.GRAY,
    fontFamily: 'Futura',
    color: 'white',
    fontSize: getFontSize(16),
    marginBottom: 12,
    fontWeight: '400',
    letterSpacing: 10,
    textAlign: 'center'
  },
  subHeadingText: {
  //  marginBottom: 10,
    // color: Colors.GRAY,
    color: 'white',
    fontStyle: 'italic',
    fontSize: getFontSize(14),
    textAlign: 'center'
//    height: 34
  }
})

Boarding.propTypes = {
  imageSource: React.PropTypes.number.isRequired,
  headText: React.PropTypes.string.isRequired,
  subHeadText: React.PropTypes.string.isRequired
}

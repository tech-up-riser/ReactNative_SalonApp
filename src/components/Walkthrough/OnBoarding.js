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

export default class Boarding extends Component {

  renderBullets (bulletsArray) {
    return (bulletsArray).map((bullet, key) => (
      <View key={key} style={styles.bulletsContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.subHeadingText, styles.rightMargin]}>{key+1}.</Text>
          <Text style={styles.subHeadingText}>{bullet}</Text>
        </View>
      </View>
      )
    )
  }

  renderThirdSlide () {
    return (
      <View style={styles.thirdSlideContainer}>
        <Text style={styles.subHeadingTextBig}>{this.props.subHeadText}</Text>
        <Image style={styles.caretImage} resizeMode={'contain'} source={require('../../assets/images/down-double-caret.png')}/>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.onBoarding}>
          <Image style={styles.image} resizeMode={'stretch'} source={this.props.imageSource}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>{this.props.headText}</Text>
          {(this.props.bulletsArray) ? this.renderBullets(this.props.bulletsArray) : this.renderThirdSlide() }
        </View>
        <View style={styles.signInTextsContainer}>
          <View style={{flex: 1}} />
          <Text style={[styles.font, styles.grayFont]}>ALREADY HAVE AN ACCOUNT?</Text>
          <TouchableOpacity onPress={this.props.onSignInPress} style={styles.signInContainer}>
            <Text style={[styles.font, styles.blueFont]}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // free place - BottomContainer height
    height: FREE_HEIGHT - VIEWPORT.height * 0.15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  onBoarding: {
    height: VIEWPORT.height * 0.45,
    backgroundColor: '#8F92A3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: VIEWPORT.width,
    flex: 1
  },
  caretImage: {
    width: VIEWPORT.width * 0.12
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 45,
    marginHorizontal: 26,
  },
  bulletsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  thirdSlideContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink'
  },
  headingText: {
    color: Colors.GRAY,
    fontSize: getFontSize(20),
    marginBottom: 32,
    // fontWeight: '200',
    fontFamily: 'Futura',
    letterSpacing: 9,
  },
  subHeadingTextBig: {
    color: '#5B5D68',
    fontSize: getFontSize(17),
    fontWeight: '200',
    fontFamily: 'BodoniSvtyTwoITCTT-BookIta',
    letterSpacing: 1
  },
  subHeadingText: {
  //  marginBottom: 10,
    // color: Colors.GRAY,
    color: '#5B5D68',
    fontSize: getFontSize(15),
    fontWeight: '200',
//    height: 34,
    fontFamily: 'BodoniSvtyTwoITCTT-BookIta',
    letterSpacing: 1,
    alignSelf: 'flex-start'
  },
  rightMargin: {
    marginRight: 5
  },
  signInTextsContainer: {
    // flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'orange',
  },
  signInContainer: {
    marginLeft: 12
  },
  font: {
    fontSize: getFontSize(12),
    fontWeight: '500'
  },
  grayFont: {
    color: '#666666'
  },
  blueFont: {
    color: '#72BED5'
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
})

Boarding.propTypes = {
  imageSource: React.PropTypes.number.isRequired,
  headText: React.PropTypes.string.isRequired,
  subHeadText: React.PropTypes.string,
  bulletPoints: React.PropTypes.bool
}

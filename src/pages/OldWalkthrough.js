import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Image,
  ScrollView
} from 'react-native'
import Swiper from 'react-native-swiper'
import OnBoarding from '../components/Walkthrough/OnBoarding'
import BottomContainer from '../components/Walkthrough/BottomContainer'
import { connect } from 'react-redux'
import { changeAppRoot } from '../actions/initAC'
import * as navStates from '../constants/NavState'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT
} from '../constants'

class Walkthrough extends Component {

  constructor (props) {
    super(props)
    this.state = {
      onBoardingIndex: 0
    }
    this.onScrollNext = this.onScrollNext.bind(this)
  }

  onPressNext () {
    this.setState({ onBoardingIndex: ++this.state.onBoardingIndex })
    this.refs.swp.scrollBy(1)
  }

  onScrollNext (e, state, context) {
    this.setState({ onBoardingIndex: state.index })
  }

  signUpPressed () {
    this.props.dispatch(changeAppRoot(navStates.NAV_ROOT_SIGN_UP))
  }

  signInPressed () {
    this.props.dispatch(changeAppRoot(navStates.NAV_ROOT_SIGN_IN))
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
        </View>
        <ScrollView>
          <Swiper
            ref='swp'
            showsButtons={false}
            height={VIEWPORT.height * 0.8}
            bounces
            loop={false}
            index={this.state.onBoardingIndex}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            onMomentumScrollEnd={this.onScrollNext}>
            <OnBoarding
              imageSource={require('../assets/images/onBoarding1-bg.png')}
              headText={'Make every day a great hair day'}
              subHeadText={'Vurve is a new way to save on last minute blow outs at elite salons in Los Angeles'}
            />
            <OnBoarding
              imageSource={require('../assets/images/onBoarding2-bg.png')}
              headText={'Join Today'}
              subHeadText={'Tell us where and when you’d like your appointment and let Vurve handle the rest'}
            />
          </Swiper>
        </ScrollView>
        <BottomContainer
          index={this.state.onBoardingIndex}
          onPressNext={this.onPressNext.bind(this)}
          onSignInPress={this.signInPressed.bind(this)}
          onSignUpPress={this.signUpPressed.bind(this)}
          toNext={this.signUpPressed.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  dot: {
    backgroundColor: '#FFFF',
    borderColor: '#333333',
    width: 8,
    borderWidth: 1,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 15
  },
  activeDot: {
    backgroundColor: '#333333',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 15
  },
  logo: {
    width: 99,
    height: 21,
    resizeMode: 'contain'
  },
  logoContainer: {
    height: NAVIGATOR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  }
})

Walkthrough.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(Walkthrough)

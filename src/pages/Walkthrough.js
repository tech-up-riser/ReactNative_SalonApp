import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Image,
  ScrollView
} from 'react-native'
import Swiper from 'react-native-swiper'
import OnBoarding from '../components/Walkthrough/OnBoarding'
import PreteSlide from '../components/Walkthrough/PreteSlide'
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
          <Swiper
            paginationStyle={styles.pagination}
            ref='swp'
            showsButtons={false}
            height={(VIEWPORT.height * 0.918) - 20 - 44 /* TODO 44 is a guess, would prefer to know what NavBarHeight is to put here */ }
            bounces
            loop={false}
            index={this.state.onBoardingIndex}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            onMomentumScrollEnd={this.onScrollNext}>
            <PreteSlide
              imageSource={require('../assets/images/onboarding-dryer-bg.png')}
              headText={'WELCOME TO PRÊTE'}
              subHeadText={'The Best Way To Book A Blowout In Your City'}
              onSignUpPress={this.signUpPressed.bind(this)}
              onSignInPress={this.signInPressed.bind(this)}
              toNext={this.signUpPressed.bind(this)}
            />
            <OnBoarding
              imageSource={require('../assets/images/heroimage-slide2.png')}
              headText={'HOW IT WORKS'}
              bulletsArray={ ['Choose your location', 'Pick a time & date', 'Your personal Concierge will take care of the rest'] }
              bulletPoints={true}
              onSignInPress={this.signInPressed.bind(this)}
            />
            <OnBoarding
              imageSource={require('../assets/images/heroimage-slide3.png')}
              headText={"IT'S LIKE MAGIC"}
              subHeadText={'So, what are you waiting for?'}
              onSignInPress={this.signInPressed.bind(this)}
            />
          </Swiper>

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
    // backgroundColor: '#CCC',
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
    marginBottom: 15,
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
  },
  pagination: {
    justifyContent: 'flex-start',
    marginLeft: 36
  }
})

Walkthrough.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(Walkthrough)

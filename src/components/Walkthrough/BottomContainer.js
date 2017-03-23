import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import Button from '../Common/Button'
import { VIEWPORT } from '../../constants'
import { getFontSize } from '../../utils/DynamicSize'

export default class BottomContainer extends Component {

  constructor (props) {
    super(props)
    this.onPressNext = props.onPressNext
  }

  render () {
    if (this.props.index > 1) {
      return this.renderSignUpContainer()
    } else {
      return this.renderNextContainer()
    }
  }

  renderNextContainer () {
    return (
      <View style={styles.container}>
        <View style={styles.signInTextsContainer}>
          <Text style={[styles.font, styles.grayFont]}>ALREADY HAVE AN ACCOUNT?</Text>
          <TouchableOpacity onPress={this.props.onSignInPress} style={styles.signInContainer}>
            <Text style={[styles.font, styles.blueFont]}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <Button
          type={'fullWidth'}
          label={'NEXT'}
          backgroundColor={'#5B5D68'}
          handleOnPress={this.onPressNext}
          withArrow
          fontSize={getFontSize(14)}
        />
      </View>
    )
  }

  renderSignUpContainer () {
    return (
      <View style={styles.container}>
        <View style={styles.signInTextsContainer}>
          <Text style={[styles.font, styles.grayFont]}>ALREADY HAVE AN ACCOUNT?</Text>
          <TouchableOpacity onPress={this.props.onSignInPress} style={styles.signInContainer}>
            <Text style={[styles.font, styles.blueFont]}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
        <Button
          type={'fullWidth'}
          label={'SIGN UP'}
          backgroundColor={'#FBD6CA'}
          handleOnPress={this.props.onSignUpPress}
          fontSize={getFontSize(14)}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: VIEWPORT.height * 0.65,
    justifyContent: 'flex-start',
    backgroundColor: 'cyan',
    flex: 1
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
  signInTextsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    // marginTop: -50
  },
  signInContainer: {
    marginLeft: 12
  }
})

BottomContainer.propTypes = {
  index: PropTypes.number.isRequired,
  toNext: PropTypes.func,
  onSignInPress: PropTypes.func,
  onSignUpPress: PropTypes.func,
  onPressNext: PropTypes.func
}

BottomContainer.defaultProps = {
  index: 0
}

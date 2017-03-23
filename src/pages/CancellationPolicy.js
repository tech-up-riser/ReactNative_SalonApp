import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native'

import BackButton from '../components/BackButton'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR
} from '../constants'

class CancellationPolicy extends Component {

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.pop({})}/>
        <Text style={styles.navTitle}>Cancellation Policy</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        <ScrollView>
          <Text>
            Cancellation policy text should be here
          </Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    flex: 4,
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  }
})

CancellationPolicy.propTypes = {
  navigator: PropTypes.object.isRequired
}

export default CancellationPolicy

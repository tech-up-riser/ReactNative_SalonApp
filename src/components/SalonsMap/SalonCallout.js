import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

class SalonCallout extends Component {
  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.bubble, {width: this.props.width, height: this.props.height}]}>
          <View style={styles.amount}>
            {this.props.children}
          </View>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start'
  },
  bubble: {
    width: 140,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    // backgroundColor: '#4da2ab',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: '#007a87',
    borderWidth: 1.5
  },
  amount: {
    flex: 1
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderColor: 'transparent',
  //  borderTopColor: '#4da2ab',
    borderTopColor: '#ffffff',
    alignSelf: 'center',
    marginTop: -24
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 11,
    borderColor: 'transparent',
    // borderTopColor: '#007a87',
    borderTopColor: '#007a87',
    alignSelf: 'center',
    marginTop: -1.5
  }
})

SalonCallout.defaultProps = {
  width: 140,
  height: 70
}

SalonCallout.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
}

export default SalonCallout

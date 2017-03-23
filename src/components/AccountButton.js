import React, { Component, PropTypes } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'

export default class AccountButton extends Component {

  render () {
    return (
      <TouchableOpacity onPress={this.props.onClick} style={styles.container}>
        <Image source={require('../assets/images/Account.png')} style={styles.account} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  account: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  //  marginLeft: 10,
    marginRight: 15
  }
})

AccountButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

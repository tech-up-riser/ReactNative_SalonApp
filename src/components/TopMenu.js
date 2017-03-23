import React, { Component, PropTypes } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { NAVIGATOR_HEIGHT } from './constants'
import SearchBar from './Common/SearchBar'
class TopMenu extends Component {
  constructor () {
    super()
  }
  setInputs (type) {
    return (text) => {
      this.setState({
        [type]: text
      })
      //console.log(this.state[type])
    }
  }

  render () {
    return (
    <View style={styles.container}>
      <Image source={require('../assets/images/left-caret.png')} />
      <View style={styles.inputFieldContainer}>
        <View style={styles.textAndLabel}>
          <SearchBar
              setInput={this.setInputs('searchItem')}
              placeholder={''}
              keyboardType={'ascii-capable'}
              />
        </View>
      </View>
      <Image source={require('../assets/images/account-icon.png')} />
    </View>
    )
  }
}

TopMenu.defaultProps = {

}

TopMenu.propTypes = {

}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 3,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'cyan',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowRadius: 1,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  textAndLabel: {
    marginLeft: 5,
    //marginRight: 25,
    //marginTop: 18.5
  },
  inputFieldContainer: {
    flex: 1,
    height: 45,
    marginHorizontal: 15,
    // borderColor: '#DDE1E4',
    // borderRadius: 5,
    // borderWidth: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

export default TopMenu

import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native'
import { connect } from 'react-redux'
import { setSearchingText } from '../actions/searchingTextAction'
import { setSearchBarText } from '../actions/searchBarTextAction'
import { VIEWPORT } from '../constants'
import Icon from 'react-native-vector-icons/MaterialIcons'

const MODE_ICON = 'MODE_ICON'
const MODE_INPUT = 'MODE_INPUT'

class SearchBar extends Component {

  constructor (props) {
    super(props)
    this.state = {
      text: '',
      mode: MODE_ICON
    }
  }

  componentWillReceiveProps (props) {
    const { searchBarText } = props
    this.setState({ text: searchBarText })
  }

  onTextChange (text) {
    const { dispatch } = this.props
    dispatch(setSearchingText(text))
    // dispatch(setSearchBarText(text))
    this.setState({ text: text })
  }

  clear () {
    const { dispatch } = this.props
    dispatch(setSearchingText(''))
    dispatch(setSearchBarText(''))
    this.setState({
      text: '',
      mode: MODE_ICON
    })
  }


  renderModeInput () {
    const { text } = this.state
    return (
      <View style={styles.container}>
        <Image source={require('../assets/images/Search.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          onFocus={(f) => console.log('onFocus')}
          onChangeText={(text) => this.onTextChange(text)}
          value={text}
          placeholder={'Find an address'}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => this.clear()}
        >
          <Image source={require('../assets/images/clear-button.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    )
  }

  renderModeIcon () {
    return (
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => this.setState({mode: MODE_INPUT})}
          >
          <Icon
            name={'search'}
            size={18}
            color='#5B5D68'
            />
        </TouchableOpacity>
      // <TouchableOpacity
      //   onPress={() => this.setState({mode: MODE_INPUT})}
      // >
      //   <View style={styles.containerIcon}>
      //     <Image source={require('../assets/images/Search.png')} style={styles.iconMode} />
      //   </View>
      // </TouchableOpacity>
    )
  }

  render () {
    if (this.state.mode === MODE_ICON) {
      return this.renderModeIcon()
    } else {
      return this.renderModeInput()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: VIEWPORT.width,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: '#FFFFFF'
  },
  searchIcon: {
    // position: 'absolute',
    // bottom: VIEWPORT.height * 0.04,
    // right: VIEWPORT.width,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#979797',
    borderWidth: 1,
    borderRadius: 24,
    padding: 6,
    marginTop: 8,
    marginLeft: 8
  },
  containerIcon: {
    left: 20,
    top: 20
  },
  icon: {
    width: 15,
    height: 15
  },
  iconMode: {
    width: 25,
    height: 25
  },
  input: {
    // width: 300,
    flex: 1,
    alignSelf: 'center',
    marginLeft: 8,
    fontSize: 14.4,
    fontWeight: '300',
    color: '#4A4A4A',
    height: 30
  },
  clearButton: {
    width: 37,
    height: Platform.OS === 'ios' ? 44 : 56,
    alignItems: 'center',
    justifyContent: 'center'
  }
})


SearchBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  searchBarText: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  // searchBarText: state.searchingText
  searchBarText: state.searchBarText
})

export default connect(mapStateToProps)(SearchBar)

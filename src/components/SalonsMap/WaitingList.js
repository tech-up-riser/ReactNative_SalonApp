import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import { VIEWPORT } from '../../constants'
import { getFontSize } from '../../utils/DynamicSize'
import Icon from 'react-native-vector-icons/Ionicons'

class WaitingList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addedToWaitingList: false
    }
  }

  addToWaitList () {
    this.setState({
      addedToWaitingList: true
    })
  }

  renderWaitingListButton () {
    const buttonLabel = (this.state.addedToWaitingList) ? "Added to wait list" : "Tell me when you're here!"
    return (this.state.addedToWaitingList) ?
      <View style={styles.added}>
        <Text style={styles.addedText}>{buttonLabel}</Text>
      </View>
      :
      <TouchableOpacity onPress={this.addToWaitList.bind(this)} style={styles.button}>
        <Text style={styles.buttonText}>{buttonLabel.toUpperCase()}</Text>
      </TouchableOpacity>
  }

  render () {
    return (
        <View style={styles.container}>
          <View style={styles.closeX}>
              <TouchableOpacity
                onPress={() => {
                    this.props.navigator.popToRoot({animated: false})
                    this.props.navigator.dismissLightBox({})
                  }}
                style={styles.closeButton}
              >
                <Icon
                  name={'ios-close'}
                  size={40}
                  color={'#666'}
                  backgroundColor={'transparent'}
                  style={styles.img}
                />
              </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View>
              <Text style={styles.heading}>{"Uh oh! We aren't in your area yet :("}</Text>
              <Text style={styles.subHeading}>{"Click below to be notified as soon as we are. Maybe we'll even send you a bottle of Champagne to celebrate."}</Text>
            </View>
            <Image
              reSizeMode={'contain'}
              style={styles.logo}
              source={require('../../assets/images/champagne.png')}
              />
            {this.renderWaitingListButton()}
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: VIEWPORT.height * 0.63,
    width: VIEWPORT.width * 0.8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#9B9B9B',
    shadowColor: '#000000',
    shadowRadius: 12,
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 15},
    paddingTop: 5,
  },
  content: {
    // height: (VIEWPORT.height * 0.63) - VIEWPORT.height * 0.06,
    paddingHorizontal: 25,
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  closeX: {
    height: VIEWPORT.height * 0.06,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginRight: 15
  },
  logo: {
    // height: VIEWPORT.height * 0.2,
    // width: VIEWPORT.width * 0.2,
    height: 85,
    width: 85,
    marginVertical: 20
  },
  heading: {
    fontSize: getFontSize(22),
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '600',
    // color: 'rgba(74, 74, 74, 100)',
    color: 'black',
    marginBottom: 20
  },
  subHeading: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: getFontSize(16),
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#4A4A4A',
    // marginBottom: 10
  },
  button: {
    borderColor: '#979797',
    // borderColor: 'rgba(74, 74, 74, 100)',
    borderWidth: 2,
    paddingHorizontal: getFontSize(17),
    paddingVertical: getFontSize(12),
    marginTop: 10
  },
  buttonText: {
    fontWeight: '500',
    fontSize: getFontSize(13),
    color: '#4A4A4A'
  },
  added: {
    paddingHorizontal: getFontSize(17),
    paddingVertical: getFontSize(12),
  },
  addedText: {
    color: '#FBD6CA',
    fontWeight: '600',
    fontSize: getFontSize(16),
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

WaitingList.defaultProps = {

}

WaitingList.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default (WaitingList)

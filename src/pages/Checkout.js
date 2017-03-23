import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import Pack from '../components/Checkout/Pack'
import BackButton from '../components/BackButton'
import AccountButton from '../components/AccountButton'
import makeGetBlowoutsCount from '../selectors/BlowoutsCountSelector'
import Button from '../components/Common/Button'
import screens from '../constants/Screens'
import { addRequest } from '../actions/usersAction'
import Spinner from '../components/Common/Spinner'
import * as _ from 'lodash'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT,
  FREE_HEIGHT,
  SUBMIT_BUTTON_HEIGHT
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

const VURVE_BALANCE = 'VURVE_BALANCE'
const IMAGE_HEIGHT = VIEWPORT.width / 749 * 349

class Checkout extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected: '',
      isLoading: false,
      // width: 0,
      // height: 0
    }
  }

  // componentDidMount () {
  //   Image.getSize('../assets/images/membership-bg.png', (width, height) => {
  //     this.setState({width: width, height: height})
  //   }
  // )

  handleOnPress () {
    console.log('next to payment button pressed', this.props.request)
    if (this.state.selected === VURVE_BALANCE) {
      console.log('request', this.props.request, 'blowoutsCount', this.props.blowoutsCount)
      if (this.props.blowoutsCount > 0) {
        this.setState({
          isLoading: true
        })
        this.props.dispatch(addRequest(this.props.request, (request) => {
          this.setState({
            isLoading: false
          })
          if (request) {
            this.props.navigator.push({
              screen: screens.REQUEST_CONFIRMATION,
              navigatorStyle: {
                navBarHidden: true
              },
              passProps: {
                request: request
              }
            })
          }
        }))
      }
    } else if (this.state.selected !== '') {
      this.props.navigator.push({
        screen: screens.BUY_PACKAGE,
        navigatorStyle: {
          navBarHidden: true
        },
        passProps: {
          packId: this.state.selected
        }
      })
    }
  }

  openDrawer () {
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.pop()} />
        <Text style={styles.navTitle}>Checkout</Text>
        <AccountButton onClick={this.openDrawer.bind(this)} />
      </View>
    )
  }

  render () {
    const usersBalance = {
      count: this.props.blowoutsCount,
      price: 'PAID'
    }
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <View style={styles.contentContainer}>
          {this.renderCreditCard()}
          {this._renderHeading('SELECT PACKAGE')}

          {this._renderPackagesList()}
          {/* </View>
          <View> */}
          {this._renderHeading('BECOME A MEMBER')}
          {this.renderMembership()}
        </View>


        <Button
          type={'fullWidth'}
          label={'CHECKOUT'}
          backgroundColor={'#5B5D68'}
          handleOnPress={this.handleOnPress.bind(this)}
          withArrow
          fontSize={getFontSize(14)}
        />
        <Spinner visible={this.state.isLoading} />
      </View>
    )
  }

  renderCreditCard () {
    return (
      <View style={styles.creditContainer}>
        <Text>ADD / CHANGE CARD</Text>
        <Text>**** **** ***** -4393</Text>
        <Image resizeMode={'center'} source={require('../assets/images/visa.png')} style={[styles.cellIcon, styles.visa]} />

      </View>
    )
  }

  handleLearnMoreOnPress () {
    console.log('handleLearnMoreOnPress')
  }

  renderMembership () {
    return (
      <View style={styles.memberContainer}>
        <Image
          resizeMode={'contain'}
          style={styles.memberImage}
          source={require('../assets/images/membership-bg.png')} />
        <Text style={styles.imageHeadingText}>UNLIMITED BLOWOUTS</Text>
        <Text style={styles.imagePriceText}>$129 per month</Text>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this.handleLearnMoreOnPress.bind(this)}
          style={styles.learnMoreButton}
        >
          <Text style={styles.learnMoreText}>
            LEARN MORE
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  clickHandler (packId) {
    console.log('clickHandler', packId)
    this.setState({selected: packId})
  }

  _renderPackagesList () {
    const { packs } = this.props
    return _.map(packs, (pack, id) => {
      console.log('render pack', id, pack)
      if (pack.isEnabled) {
        return (
          <Pack
            key={id}
            pack={pack}
            packId={id}
            addThinLine
            selectedId={this.state.selected}
            clickHandler={this.clickHandler.bind(this)}
          />
        )
      }
    })
  }

  _renderHeading (title) {
    return (
      <View style={styles.heading}>
        <Text style={styles.headingText}>{title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    height: FREE_HEIGHT,
    marginTop: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
    flexDirection: 'column'
  },
  statusBar: {
    position: 'absolute',
    top: 0,
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
    position: 'absolute',
    width: VIEWPORT.width,
    top: STATUS_BAR_HEIGHT,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAED',
    height: dynamicSize(25),
    width: VIEWPORT.width
  },
  headingText: {
    color: '#666666',
    marginLeft: 20,
    fontSize: getFontSize(12)
  },
  imageHeadingText: {
    fontFamily: 'Futura',
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: getFontSize(24),
    fontWeight: '400',
    letterSpacing: 2,
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: IMAGE_HEIGHT * 0.22,
    width: VIEWPORT.width
  },
  imagePriceText: {
    fontFamily: 'Futura',
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: getFontSize(16),
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: IMAGE_HEIGHT * 0.46,
    width: VIEWPORT.width
  },
  learnMoreButton: {
    backgroundColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: IMAGE_HEIGHT * 0.7,
    left: VIEWPORT.width * 0.35,
    height: IMAGE_HEIGHT * 0.2,
    width: VIEWPORT.width * 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  learnMoreText: {
    fontFamily: 'Futura',
    color: '#444444',
    fontSize: getFontSize(11)
  },
  memberContainer: {
    justifyContent: 'center',
    height: IMAGE_HEIGHT,
    alignItems: 'center'
  },
  memberImage: {
    width: VIEWPORT.width,
    height: IMAGE_HEIGHT
  },
  creditContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 25,
    alignItems: 'center'
  },
  visa: {
    width: 38,
    height: 12
  }
})

Checkout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  blowoutsCount: PropTypes.number.isRequired,
  packs: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired
}

const makeMapStateToProps = () => {
  const getBlowoutsCount = makeGetBlowoutsCount()
  const mapStateToProps = (state, props) => {
    return {
      blowoutsCount: getBlowoutsCount(state, props),
      packs: state.packs
    }
  }
  return mapStateToProps
}

export default connect(makeMapStateToProps())(Checkout)

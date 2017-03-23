import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  VIEWPORT
} from '../constants'
import { connect } from 'react-redux'
import Pack from '../components/Checkout/Pack'
import Button from '../components/Common/Button'
import BackButton from '../components/BackButton'
import screens from '../constants/Screens'
import * as _ from 'lodash'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class Checkout extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected: ''
    }
  }

  handleOnPress () {
    console.log('next topayment button pressed')
    if (this.state.selected !== '') {
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

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.dismissModal({})}/>
        <Text style={styles.navTitle}>Add blowouts</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  render () {
    return (
      <View
        style={styles.container}
      >
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        <ScrollView>
          <Text style={styles.headingText}>Choose a Vurve package</Text>
          <View style={styles.thinLine}/>
          <View style={{height: VIEWPORT.height * 0.16 * this.props.packs.length}}>
            {this._renderPackagesList()}
          </View>
          <View style={styles.thinLine}/>
        </ScrollView>
        <Button
          type={'fullWidth'}
          label={'CONTINUE TO PAYMENT'}
          backgroundColor={'#5B5D68'}
          handleOnPress={this.handleOnPress.bind(this)}
          fontSize={getFontSize(14)}
          withArrow
        />
      </View>
    )
  }

  clickHandler (packId) {
    console.log('clickHandler', packId)
    this.setState({ selected: packId })
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
            selectedId={this.state.selected}
            clickHandler={this.clickHandler.bind(this)}
          />
        )
      }
    })
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
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  heading: {
//    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: dynamicSize(25),
    paddingVertical: dynamicSize(15),
    backgroundColor: '#EAEAED',
    height: dynamicSize(25)
  },
  headingText: {
    fontSize: getFontSize(19),
    color: '#5B5D68',
    marginBottom: dynamicSize(24),
    alignSelf: 'center',
    marginHorizontal: dynamicSize(25),
    marginTop: dynamicSize(54),
    textAlign: 'center'
  },
  thinLine: {
    height: 1,
    backgroundColor: 'black',
    opacity: 0.10
  },
  pack: {},
  bottomButton: {
    alignSelf: 'flex-end'
  }
})

// ---
// Props
// ---
Checkout.propTypes = {
  navigator: PropTypes.object.isRequired,
  packs: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  packs: state.packs
})

export default connect(mapStateToProps)(Checkout)

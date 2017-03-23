import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'
// import PaymentForm from '../components/PaymentForm'
import PaymentForm from '../components/ModernPaymentForm'
import BackButton from '../components/BackButton'
import Button from '../components/Common/Button'
import { checkout } from '../actions/checkoutAC'
import Spinner from '../components/Common/Spinner'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  DARK_COLOR
} from '../constants'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class BuyPackage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      cardNumber: null,
      cardExpiryDate: null,
      cvv: null,
      zipCode: null,
      isLoading: false
    }
  }

  cancelLoading () {
    this.setState({
      isLoading: false
    })
  }

  onSubmit () {
    const cardDetails = this.refs.paymentForm.state
    console.log(cardDetails)
    if (cardDetails.valid) {
      this.setState({
        isLoading: true
      })
      this.props.dispatch(checkout(cardDetails, this.props.packId, this.props.navigator, this.cancelLoading.bind(this)))
    }
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton onClick={() => this.props.navigator.pop({})}/>
        <Text style={styles.navTitle}>Checkout</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  render () {
    const pack = this.props.packs[this.props.packId]
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        <KeyboardAwareScrollView ref='scroll' style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerNumber}>
              {pack.count}
            </Text>
            <Text style={styles.headerText}>
              {pack.count > 1 ? ' blowouts' : ' blowout'}
            </Text>
          </View>

          <PaymentForm
            ref='paymentForm'
            price={parseInt(pack.price, 10)}
            submitButtonTitle='BUY PACKAGE'
            callback={this.onSubmit}
          />
        </KeyboardAwareScrollView>
        <Button
          type={'fullWidth'}
          label={'BUY PACKAGE'}
          backgroundColor={'#EAA0B3'}
          handleOnPress={this.onSubmit.bind(this)}
          fontSize={getFontSize(14)}
        />

        <Spinner visible={this.state.isLoading} />
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
    fontSize: getFontSize(14),
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  headerContainer: {
    marginTop: dynamicSize(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerNumber: {
    color: DARK_COLOR,
    fontSize: getFontSize(32),
    fontWeight: '500'
  },
  headerText: {
    color: DARK_COLOR,
    fontSize: getFontSize(18)
  }
})

BuyPackage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  packs: PropTypes.object.isRequired,
  packId: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  packs: state.packs
})

export default connect(mapStateToProps)(BuyPackage)

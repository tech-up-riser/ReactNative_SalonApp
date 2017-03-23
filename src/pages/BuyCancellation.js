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
import { checkout } from '../actions/checkoutCancellationAC'
import Spinner from '../components/Common/Spinner'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR,
  DARK_COLOR
} from '../constants'

class BuyCancellation extends Component {

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
      this.props.dispatch(checkout(cardDetails, this.props.packId, this.props.requestId, this.cancelLoading.bind(this)))
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
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        <KeyboardAwareScrollView ref='scroll' style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Cancel appointement</Text>
          </View>

          <PaymentForm
            ref='paymentForm'
            price={parseInt(this.props.settings.cancellationFee, 10)}
            callback={this.onSubmit}
          />
        </KeyboardAwareScrollView>
        <Button
          type={'fullWidth'}
          label={'CANCEL APPOINTEMENT'}
          backgroundColor={'#EAA0B3'}
          handleOnPress={this.onSubmit.bind(this)}
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
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '300',
    textAlign: 'center'
  },
  headerContainer: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerNumber: {
    color: DARK_COLOR,
    fontSize: 32,
    fontWeight: '500'
  },
  headerText: {
    color: DARK_COLOR,
    fontSize: 18
  }
})

BuyCancellation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  packId: PropTypes.string.isRequired,
  requestId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps)(BuyCancellation)

import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import PaymentForm from './PaymentForm'

export default class Payment extends Component {

  constructor (props) {
    super(props)

    this.state = {
      cardNumber: null,
      cardExpiryDate: null,
      cvv: null,
      zipCode: null
    }
  }

  onSubmit (paymentInfo) {
    console.log(paymentInfo)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{height: 45, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
          <Text>(Topnav/menu placeholder)</Text>
        </View>
        <PaymentForm package={this.props.package} submitButtonTitle='REQUEST  VURVE' callback={this.onSubmit}/>
      </View>
    )
  }

}

// ---
// Props
// ---
Payment.propTypes = {
  package: React.PropTypes.object.isRequired
}

// ---
// Fixtures
// ---
Payment.defaultProps = {
  package: {
    id: 2,
    count: 3,
    price: 99,
    valid: 'up to a year',
    savings: 'SAVE 6 %'
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1
  }
})

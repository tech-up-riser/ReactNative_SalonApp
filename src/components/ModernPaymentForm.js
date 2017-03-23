import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import {DARK_COLOR, PINK_COLOR, PLACEHOLDER_COLOR, SUBMIT_BUTTON_HEIGHT} from '../constants'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { CreditCardInput } from 'react-native-credit-card-input'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'
import { CardIOView, CardIOUtilities } from 'react-native-awesome-card-io'

export default class PaymentForm extends Component {

  constructor (props) {
    super(props)

    console.log('>>>> CARDIO', CardIOView, CardIOUtilities)

    this.state = {
      cardNumber: null,
      cardExpiryDate: null,
      cvv: null,
      zipCode: null
    }
  }

  _onChange (v) {
//    console.log('onChange', v)
    if (v.valid) {
      this.setState({
        valid: true,
        cardNumber: v.values.number,
        cvv: v.values.cvc,
        cardExpiryDate: v.values.expiry
      })
    } else {
      this.setState({
        valid: false
      })
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView ref='scroll' style={styles.scrollView} extraHeight={SUBMIT_BUTTON_HEIGHT * 1.5} viewIsInsideTabBar>
          <View style={styles.subcontainer}>
            <View style={styles.priceContainer}>
              <View style={styles.line} />
              <Text style={styles.price}>${this.props.price}</Text>
              <View style={styles.line} />
            </View>
            <CreditCardInput
              onChange={this._onChange.bind(this)}
              placeholders={{ number: '1234 5678 1234 5678', expiry: 'MM/YY', cvc: '123' }}
              labelStyle={styles.cellTitle}
              inputStyle={styles.textInput}
              imageFront={require('../assets/card.png')}
              imageBack={require('../assets/card.png')}
              cardViewSize={{width: dynamicSize(300), height: dynamicSize(180)}}
              autoFocus
              //                onFocus={(event) => this._scrollToInput(event)}
            />
            {/* <View style={styles.line} /> */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

}

PaymentForm.propTypes = {
  price: PropTypes.number.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexible: {
    flex: 1
  },
  subcontainer: {
    marginHorizontal: dynamicSize(30),
    marginBottom: dynamicSize(32)
  },
  scrollView: {
    margin: 0,
    padding: 0
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
  },
  priceContainer: {
    marginTop: dynamicSize(16),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: dynamicSize(24)
  },
  price: {
    color: '#EAA0B3',
//    color: PINK_COLOR,
    fontSize: getFontSize(32),
    fontWeight: '500',
    marginHorizontal: dynamicSize(23)
  },
  line: {
    backgroundColor: '#000000',
    height: 1,
    opacity: 0.1,
    flex: 1
  },
  cell: {
    height: dynamicSize(74)
  },
  cellWithImage: {
    flexDirection: 'row'
  },
  cellTitle: {
    color: PLACEHOLDER_COLOR,
    fontWeight: '300',
    fontSize: getFontSize(12)
//    marginTop: 22
  },
  textInput: {
    height: dynamicSize(40),
    fontSize: getFontSize(14)
  }
})

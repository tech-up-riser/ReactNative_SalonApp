import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  findNodeHandle
} from 'react-native'
import {DARK_COLOR, PINK_COLOR, PLACEHOLDER_COLOR} from '../constants'
import { trimNoDigits } from './Helpers'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default class PaymentForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      cardNumber: null,
      cardExpiryDate: null,
      cvv: null,
      zipCode: null
    }
  }

  onCardNumberChange (cardNumber) {
    cardNumber = trimNoDigits(cardNumber)
    var matches = cardNumber.match(/\d{4,19}/g)
    var match = matches && matches[0] || ''
    var parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      cardNumber = parts.join(' ')
    }
    this.setState({cardNumber: cardNumber})
  }

  onCardExpiryDateChange (cardExpiryDate) {
    cardExpiryDate = trimNoDigits(cardExpiryDate)
    var matches = cardExpiryDate.match(/\d{2,7}/g)
    var match = matches && matches[0] || ''
    var parts = []
    for (let i = 0; i < match.length; i += 2) {
      parts.push(match.substring(i, i + 2))
    }

    if (parts.length) {
      cardExpiryDate = parts.join(' / ')
    }
    this.setState({cardExpiryDate: cardExpiryDate})
  }

  onCVVChange (cvv) {
    cvv = trimNoDigits(cvv)
    this.setState({cvv: cvv})
  }

  onZipCodeChange (zipCode) {
    this.setState({zipCode: zipCode})
  }

  _scrollToInput (event) {
    let node = findNodeHandle(event.target)
    let extraHeight = 70
    this.refs.scroll.scrollToFocusedInput(node, extraHeight)
  }

  render () {
    const { pack } = this.props
    if (pack) {
      const {cardNumber, cardExpiryDate, cvv, zipCode} = this.state
      const cardNumberPlaceholder = 'CARD NUMBER'
      const cardExpiryDatePlaceholder = 'MM/YY'
      const cvvPlaceholder = 'CVV'
      const zipCodePlaceholder = 'ZIP CODE'
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView ref='scroll' style={styles.scrollView}>
            <View style={styles.subcontainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerNumber}>
                  {pack.count}
                </Text>
                <Text style={styles.headerText}>
                  {pack.count > 1 ? ' blowouts' : ' blowout'}
                </Text>
              </View>
              <View style={styles.priceContainer}>
                <View style={styles.line} />
                <Text style={styles.price}>${pack.price}</Text>
                <View style={styles.line} />
              </View>
              <View style={[styles.cell, styles.cellWithImage]}>
                <View style={styles.flexible}>
                  <Text style={styles.cellTitle}>{cardNumberPlaceholder}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={cardNumber}
                    onChangeText={this.onCardNumberChange.bind(this)}
                    keyboardType='numeric'
                    placeholder={cardNumberPlaceholder}
                    maxLength={23}
                    ref={ r => this.cardNumberInput = r }
                    onFocus={(event) => this._scrollToInput(event)}
                  />
                </View>
                <Image source={require('../assets/images/visa.png')} style={[styles.cellIcon, styles.visa]} />
              </View>
              <View style={styles.line} />
              <View style={styles.cell}>
                <Text style={styles.cellTitle}>{cardExpiryDatePlaceholder}</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardExpiryDate}
                  onChangeText={this.onCardExpiryDateChange.bind(this)}
                  keyboardType='numeric'
                  placeholder={cardExpiryDatePlaceholder}
                  maxLength={7}
                  ref={ r => this.cardExpiryInput = r }
                  onFocus={(event) => this._scrollToInput(event)}
                />
              </View>
              <View style={styles.line} />
              <View style={[styles.cell, styles.cellWithImage]}>
                <View style={styles.flexible}>
                  <Text style={styles.cellTitle}>{cvvPlaceholder}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={cvv}
                    onChangeText={this.onCVVChange.bind(this)}
                    keyboardType='numeric'
                    placeholder={cvvPlaceholder}
                    maxLength={3}
                    secureTextEntry
                    ref={ r => this.cvvInput = r }
                    onFocus={(event) => this._scrollToInput(event)}
                  />
                </View>
                <Image source={require('../assets/images/credit-card-icon.png')} style={[styles.cellIcon, styles.creditCardIcon]} />
              </View>
              <View style={styles.line} />
              <View style={styles.cell}>
                <Text style={styles.cellTitle}>{zipCodePlaceholder}</Text>
                <TextInput
                  style={styles.textInput}
                  value={zipCode}
                  onChangeText={this.onZipCodeChange.bind(this)}
                  placeholder={zipCodePlaceholder}
                  ref={ r => this.zipCodeInput = r }
                  onFocus={(event) => this._scrollToInput(event)}
                />
              </View>
              <View style={styles.line} />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )
    } else {
      return null
    }
  }

}

PaymentForm.propTypes = {
  pack: PropTypes.object
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexible: {
    flex: 1
  },
  subcontainer: {
    marginHorizontal: 30,
    marginBottom: 32
  },
  scrollView: {
    margin: 0,
    padding: 0
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
  },
  priceContainer: {
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24
  },
  price: {
    color: '#EAA0B3',
//    color: PINK_COLOR,
    fontSize: 32,
    fontWeight: '500',
    marginHorizontal: 23
  },
  line: {
    backgroundColor: '#000000',
    height: 1,
    opacity: 0.1,
    flex: 1
  },
  cell: {
    height: 74
  },
  cellWithImage: {
    flexDirection: 'row'
  },
  cellTitle: {
    color: PLACEHOLDER_COLOR,
    fontSize: 12,
    marginTop: 22
  },
  textInput: {
    height: 40,
    fontSize: 14
  },
  visa: {
    width: 38,
    height: 12,
    alignSelf: 'flex-end',
    marginBottom: 15
  },
  creditCardIcon: {
    width: 46,
    height: 30,
    alignSelf: 'flex-end',
    marginBottom: 12
  },
  submitButton: {
    backgroundColor: PINK_COLOR,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  }
})

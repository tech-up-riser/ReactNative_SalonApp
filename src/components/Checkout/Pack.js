import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'
import { getFontSize, dynamicSize } from '../../utils/DynamicSize'
import { VIEWPORT } from '../../constants'

export default class Pack extends Component {

  render () {
    const {selectedId, pack, addThinLine, clickHandler, packId} = this.props
    const checkboxStyle = (packId === selectedId) ? [styles.circleUnchecked, styles.circleChecked] : styles.circleUnchecked
    const packStyle = (packId === selectedId) ? [styles.packContainer, styles.selectedPack] : styles.packContainer
    return (
      <TouchableOpacity
        onPress={() => clickHandler(packId)}
        activeOpacity={1}
      >
        <View style={styles.container}>
          <View key={pack.count} style={packStyle}>
            <View style={styles.leftRowContainer}>
              <View
                onPress={() => clickHandler(packId)}
                style={checkboxStyle}>
                <Image resizeMode={'contain'} style={styles.checkImg} source={require('../../assets/images/check-icon.png')} />
              </View>
              <View>
                <Text style={styles.blowoutCountText}>
                  {pack.count > 1 ? pack.count : null}
                  <Text style={styles.blowoutTextLabel}>
                    {pack.count > 1 ? ' BLOWOUTS' : 'TRY ONE'}
                  </Text>
                </Text>
                <View style={styles.pricingContainer}>
                  <Text style={styles.pricing}>${pack.price / pack.count} / Blowout  |  </Text>
                  <Text style={styles.pricing}>Valid {pack.valid}</Text>
                </View>
              </View>

            </View>
            <View style={styles.rightRowContainer}>
              <Text style={styles.packPriceText}>{(pack.price !== 'PAID') ? '$' : ''}{pack.price}</Text>
            </View>
          </View>
          {addThinLine ? <View style={styles.thinLine} /> : null}
        </View>
      </TouchableOpacity>
    )
  }
}

Pack.propTypes = {
  selectedId: PropTypes.string,
  pack: PropTypes.object.isRequired,
  addThinLine: PropTypes.bool,
  clickHandler: PropTypes.func,
  packId: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    height: VIEWPORT.height * 0.13
  },
  circleUnchecked: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dynamicSize(30),
    borderColor: '#5B5D68',
    borderWidth: 1,
    height: dynamicSize(20),
    width: dynamicSize(20),
    borderRadius: dynamicSize(10)
  },
  circleChecked: {
    backgroundColor: '#5B5D68'
  },
  checkImg: {
    height: dynamicSize(8)
  },
  thinLine: {
    height: 1,
    backgroundColor: 'black',
  //  flex: 1,
    opacity: 0.10
  },
  leftRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  blowoutCountText: {
    fontSize: getFontSize(22),
    fontFamily: 'Futura',
    color: '#5B5D68',
    fontWeight: '600',
    alignItems: 'center'
  },
  blowoutTextLabel: {
    // fontWeight: '400',
    // fontSize: getFontSize(20),
    // fontFamily: 'Futura',
    alignItems: 'center'
  },
  rightRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: dynamicSize(40)
  },
  packPriceText: {
    color: '#8BAFBA',
    // fontWeight: '500',
    fontSize: getFontSize(24),
    textAlign: 'right'
  },
  packValidText: {
    fontSize: getFontSize(12),
    color: '#8F92A3',
    textAlign: 'right'
  },
  packSavingsText: {
    fontSize: getFontSize(12),
    color: '#8F92A3',
    textAlign: 'right'
  },
  packContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: dynamicSize(30),
//    paddingVertical: dynamicSize(20),
//    height: VIEWPORT.height * 0.13,
//    backgroundColor: '#FAFAFA'
  },
  selectedPack: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)'
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  pricing: {
    color: '#8F92A3',
    fontSize: dynamicSize(11)
  }
})

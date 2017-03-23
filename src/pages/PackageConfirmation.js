import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import {
  NAVIGATOR_HEIGHT,
  STATUS_BAR_HEIGHT,
  STATUS_BAR_COLOR
} from '../constants'
import CloseButton from '../components/CloseButton'
import { getFontSize, dynamicSize } from '../utils/DynamicSize'

class PackageConfirmation extends Component {

  _renderIconsView () {
    let hairdryers = []
    for (let i = 0; i < this.props.blowouts; ++i) {
      hairdryers.push(<Image source={require('../assets/images/hairdryer.png')} style={styles.hairdryer} key={i} />)
    }
    return <View style={styles.iconsContainer}>
      <Image source={require('../assets/images/pink-plus.png')} style={styles.plus} />
      {hairdryers}
    </View>
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <CloseButton
          onClick={() => {
            this.props.navigator.popToRoot({animated: false})
            this.props.navigator.dismissModal({})
          }}
        />
        <Text style={styles.navTitle}>Success</Text>
        <View style={{flex: 1}}/>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar}/>
        {this.renderNavBar()}
        <View style={styles.subcontainer}>
          <Image source={require('../assets/images/checkmark-in-circle.png')} style={styles.checkmark} />
          <Text style={styles.text}>Your balance has been</Text>
          <Text style={styles.text}>successfully updated</Text>
          {this._renderIconsView()}
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
//    marginTop: 20,
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
  subcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dynamicSize(65)
  },
  checkmark: {
    width: dynamicSize(80),
    height: dynamicSize(80),
    marginBottom: dynamicSize(16)
  },
  text: {
    alignSelf: 'center',
    fontWeight: '300',
    color: '#4A4A4A',
    fontSize: getFontSize(12)
  },
  iconsContainer: {
    marginTop: dynamicSize(29),
    flexDirection: 'row'
  },
  plus: {
    width: dynamicSize(23),
    height: dynamicSize(21)
  },
  hairdryer: {
    marginLeft: dynamicSize(10),
    width: dynamicSize(20),
    height: dynamicSize(20)
  }
})

PackageConfirmation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  blowouts: PropTypes.number.isRequired,
  navigator: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(PackageConfirmation)

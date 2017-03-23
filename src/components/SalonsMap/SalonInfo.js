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
import StarRating from 'react-native-star-rating'

class SalonInfo extends Component {

  onStarRatingPress (v) {
    console.log('onStarRatingPress', v)
  }

  render () {
    const { salon } = this.props
    // const salonImage = (salon.image) ? require(salon.image) : require('../../assets/images/logo.png')  //TODO: MAXIM delete the line below and uncomment this one when you add real salon data to firebase
    const salonImage = (this.props.testSalon.image) ? this.props.testSalon.image : require('../../assets/images/logo.png')
    return (
      <TouchableOpacity
        onPress={this.props.onClose}
        activeOpacity={1}
      >
        <View style={styles.superContainer}>
          <View style={styles.container}>
            <Text style={styles.salonName}>{salon.name.toUpperCase()}</Text>
            <Image
              reSizeMode={'cover'}
              style={styles.logo}
              source={salonImage}
            />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.salonAddress}>{salon.address}</Text>
            </View>
            <StarRating
              // disabled
              maxStars={5}
              rating={this.props.testSalon.stars}
              // TODO: MAXIM replace the testSalon default prop above with real salon data
              starSize={18}
              starColor={'#4A4A4A'}
              iconSet={'Ionicons'}
              fullStar={'ios-star'}
              emptyStar={'ios-star-outline'}
              halfStar={'ios-star-half'}
              selectedStar={this.onStarRatingPress.bind(this)}
            />
          </View>
        </View>
      </TouchableOpacity>
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
    height: VIEWPORT.height * 0.37,
    width: VIEWPORT.width * 0.8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: getFontSize(5)
  },
  logo: {
    width: VIEWPORT.width * 0.72,
    height: VIEWPORT.height * 0.2,
    marginBottom: 5
  },
  salonImageContainer: {
    flex: 4,
    width: VIEWPORT.width * 0.6,
    // margin: VIEWPORT.width * ,
    // height: VIEWPORT.height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  salonName: {
    flex: 1,
    fontSize: getFontSize(15),
    alignSelf: 'center',
    fontWeight: '500',
    color: 'rgba(74, 74, 74, 100)',
    marginBottom: 20
  },
  salonAddress: {
    alignSelf: 'center',
    fontSize: getFontSize(11),
    fontWeight: '400',
    color: 'rgba(74, 74, 74, 100)'
  }
})


// TODO: MAXIM you can remove these default props once you add images & star rating to each salon in firebase.  default stars for salons is 0.
SalonInfo.defaultProps = {
  testSalon: {
    image: require('../../assets/images/salon3.jpg'),
    stars: 2.5
  }
}

SalonInfo.propTypes = {
  salon: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
}

export default (SalonInfo)

import React, { PropTypes } from 'react'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import { dynamicSize } from '../../utils/DynamicSize'

const HeaderCell = ({text, color, fontSize, fontFamily, style}) => (
  <View style={[styles.container, style]}>
    <Text style={[styles.text, {color, fontSize, fontFamily}]}>
      {text}
    </Text>
  </View>
)

// PropTypes and default props
HeaderCell.defaultProps = {
  color: '#666666',
  fontSize: 12,
  fontFamily: 'Helvetica Neue'
}

HeaderCell.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  fontFamily: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: dynamicSize(20),
    height: dynamicSize(25),
    backgroundColor: '#EAEAED'
  }
})

export default HeaderCell

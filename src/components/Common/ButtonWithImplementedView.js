import React, { Component, PropTypes } from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native'

export default class ButtonWithImplementedView extends Component {

  render () {
    const ImplementRightView = this.props.implementRightView
    const ImplementLeftView = this.props.implementLeftView
    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.OnPress}
            style={[
               styles.container,
               this.props.type === 'fullWidth' && styles.fullWidthContainer,
               this.props.type === 'fullWidth' && {backgroundColor: this.props.backgroundColor}]}>
          <View style={[this.props.implementLeftViewStyle, {flex:1}]}>
            <ImplementLeftView />
          </View>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Text
                style={[
                   styles.text,
                   {color: this.props.color, fontSize: this.props.fontSize}]}>
              {this.props.label}
            </Text>
          </View>
          <ImplementRightView style={[this.props.implementRightViewStyle, {flex:1}]}/>
        </TouchableOpacity>
    )
  }
}

// PropTypes and default props
ButtonWithImplementedView.defaultProps = {
  label: '',
  type: '',
  color: '#107A86',
  fontSize: 12,
  backgroundColor: '#00D1C1',

  implementLeftView: () => <View/>,
  implementRightView: () => <View/>
}

ButtonWithImplementedView.propTypes = {
  OnPress: PropTypes.func.isRequired,

  label: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  backgroundColor: PropTypes.string,

  implementRightView: PropTypes.func,
  implementLeftView: PropTypes.func,

  implementRightViewStyle: View.propTypes.style,
  implementLeftViewStyle: View.propTypes.style
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullWidthContainer: {
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#00D1C1'
  },
  text: {
    color: '#107A86',
    fontSize: 12
  }
})

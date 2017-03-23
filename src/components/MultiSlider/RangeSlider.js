import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import MultiSlider from './MultiSlider'
import {VIEWPORT} from '../../constants'

export default class RangeSlider extends Component {

  constructor (props) {
    super(props)
    let selectedRange = false
    if (this.props.curMin && this.props.curMax) {
      selectedRange = this.props.curMin !== this.props.min || this.props.curMax !== this.props.max
    }
    this.state = {
      selectedRange
    }
    this.handleValuesChange = this.handleValuesChange.bind(this)
    this.handleValuesChangeFinish = this.handleValuesChangeFinish.bind(this)
  }

  handleValuesChangeFinish (values) {
    this.props.onChange(values[0], values[1])
  }

  handleValuesChange (values) {
    this.setState({
      selectedRange: values[0] !== this.props.min || values[1] !== this.props.max
    })
  }

  componentWillReceiveProps (nextProps) {
    const minValue = (nextProps.curMin) ? nextProps.curMin : nextProps.min
    const maxValue = (nextProps.curMax) ? nextProps.curMax : nextProps.max
    this.handleValuesChange([minValue, maxValue])
  }

  render () {
    const minValue = (this.props.curMin) ? this.props.curMin : this.props.min
    const maxValue = (this.props.curMax) ? this.props.curMax : this.props.max

    return (
      <View style={styles.container}>
        <Text
          style={styles.label}>
          {this.props.label}
        </Text>
        <MultiSlider
          sliderLength={VIEWPORT.width * 0.70}
          selectedRange={this.state.selectedRange}
          min={this.props.min}
          max={this.props.max}
          values={[minValue, maxValue]}
          step={this.props.step}
          type={this.props.type}
          customMarker={this.props.customMarker}
          trackStyle={{height: 3}}
          unselectedStyle={{backgroundColor: '#EEEEEE'}}
          selectedStyle={{backgroundColor: this.state.selectedRange ? '#EAA0B3' : '#EEEEEE'}}
          onValuesChange={this.handleValuesChange}
          onValuesChangeFinish={this.handleValuesChangeFinish}
          touchDimensions={{height: 30, width: 30, borderRadius: 0, slipDisplacement: 60}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30
  },
  label: {
//    fontFamily: 'SFUIDisplay-Regular',
    fontSize: 12,
    letterSpacing: 0.9,
    color: '#929292',
    marginBottom: 8
  },
  leftValue: {},
  valueContainer: {
    width: VIEWPORT.width * 0.70,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

RangeSlider.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([ 'time', 'age' ]).isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  curMin: PropTypes.number,
  curMax: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  customMarker: PropTypes.func
}

RangeSlider.defaultTypes = {
  label: 'your text',
  min: 0,
  max: 10,
  step: 1
}

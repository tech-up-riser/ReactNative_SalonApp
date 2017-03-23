import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Moment from 'moment'
import Chevron from './Common/Chevron'
import moment from 'moment'
import { dynamicSize } from '../utils/DynamicSize'
import * as _ from 'lodash'

export default class Appointment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appointment: this.props.item,
      styles: this.props.styles,
      data: this.props.data
    }
  }

  renderDate () {
    let type = this.state.data.type
    let appointment = this.state.appointment
    let styles = this.state.styles
    switch (type) {
      case 'requested':
        return (
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{Moment(appointment.dateStart).format('ddd, MMMM DD').toUpperCase()}</Text>
            <Text style={styles.date}>{Moment(appointment.dateStart).format('hh:mmA')} - {Moment(appointment.dateEnd).format('hh:mmA')}</Text>
          </View>
        )
      case 'scheduled':
        return (
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{Moment(appointment.booking).format('ddd, MMMM DD').toUpperCase()}</Text>
            <Text style={styles.date}>{Moment(appointment.booking).format('hh:mmA')}</Text>
          </View>
        )
      case 'past':
        return (
          <View style={styles.dateContainer}>
            <Text
              style={styles.date}>{Moment(appointment.booking).format('ddd, MMMM DD').toUpperCase()}</Text>
            <Text style={styles.date}>{Moment(appointment.booking).format('hh:mmA')}</Text>
          </View>
        )
    }
  }

  handleOnPress () {
    this.props.handleOnPress(this.props.item.id)
  }

  renderChevron () {
    const type = this.state.data.type
    const styles = this.state.styles
    const iconColor = this.state.data.iconColor
    if (type === 'past' || this.isCanceled()) return null
    return (
      <View style={styles.iconContainer}>
        <Chevron
          size={dynamicSize(30)}
          color={iconColor}
          handleOnPress={this.handleOnPress.bind(this)}
        />
      </View>
    )
  }

  isExpired () {
    const type = this.state.data.type
    const timeNowUnix = moment().unix()
    const dateEnd = moment(this.props.item.dateEnd)
    return (type === 'requested' && dateEnd.unix() < timeNowUnix)
  }

  renderExpiredMessage () {
    const isExpired = this.isExpired.bind(this)()
    if (isExpired) {
      return (
        <View style={this.state.styles.expiredContainer}>
          <Text style={this.state.styles.expiredMessage}>An appointment could not be booked.</Text>
        </View>
      )
    }
  }

  isCanceled () {
    const type = this.state.data.type
    const item = this.props.item
    if (type === 'scheduled' || type === 'past') {
      console.log('renderCanceled', item)
      if (item.dateCanceled) {
        return true
      }
    }
    return false
  }

  renderCanceled () {
    if (this.isCanceled()) {
      return (
        <View style={this.state.styles.canceledContainer}>
          <Text style={this.state.styles.canceledMessage}>The appointment was canceled.</Text>
        </View>
      )
    }
  }

  renderRage () {
    const { appointment, styles } = this.state
    if (_.has(appointment, 'range')) {
      return (
        <View style={styles.rangeContainer}>
          <Text style={styles.range}>Within {appointment.range} miles of: </Text>
        </View>
      )
    }
  }

  render () {
    let appointment = this.state.appointment
    console.log('render appointment', appointment)
    let styles = this.state.styles
    return (
      <TouchableOpacity onPress={this.handleOnPress.bind(this)}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.salonNameContainer}>
              {appointment.name ? <Text style={styles.name}>{appointment.name.toUpperCase()}</Text> : null}
            </View>
              {this.renderRage()}
            <View style={styles.addressContainer}>
              <Text style={styles.address}>{appointment.address}</Text>
            </View>
            {/* <View style={styles.dateContainer}>
              <Text style={styles.date}>
              {Moment(appointment.dateStart).format('MMM D')} between {Moment(appointment.dateStart).format('h:mm A')} - {Moment(appointment.dateEnd).format('hh:mm A')}
              </Text>
            </View> */}
            {this.renderDate.bind(this)()}
            {this.renderExpiredMessage.bind(this)()}
            {this.renderCanceled.bind(this)()}
          </View>
          {this.renderChevron.bind(this)()}
        </View>
      </TouchableOpacity>
    )
  }
}

// ---
// Props
// ---
Appointment.propTypes = {
  item: PropTypes.object,
  styles: PropTypes.object,
  data: PropTypes.object,
  handleOnPress: PropTypes.func
}

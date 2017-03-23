'use strict'
import React, { Component } from 'react'
import { StatusBar, Platform } from 'react-native'
import Navigator from './Navigator'
import { Provider } from 'react-redux'
import configureStore from '../store'

export default class App extends Component {

  constructor () {
    super()
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true)
    }
  }

  render () {
    return (
      <Provider store={configureStore()}>
        <Navigator />
      </Provider>
    )
  }
}

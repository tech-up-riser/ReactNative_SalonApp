import React, {
  AppRegistry,
  Component
} from 'react-native'
import App from './src/components/App'

class Vurve extends Component {
  render () {
    return (
      <App />
    )
  }
}

AppRegistry.registerComponent('Vurve', () => Vurve)

import RNCalendarEvents from 'react-native-calendar-events'
import co from 'co'
import { Alert } from 'react-native'

function * addEvent (event) {
  console.log('add event', event)
  try {
    const id = yield RNCalendarEvents.saveEvent(event.title, {
      location: event.location,
      startDate: event.date,
      endDate: event.date,
      alarms: [{
        date: -60
      }]
    })
    console.log('event was added to a calendar, id', id)
    Alert.alert(
      'The event was successfully added to your calendar',
      '',
      [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
    )
  } catch (e) {
    console.log('error', e)
  }
}

function * start (event) {
  try {
    const status = yield RNCalendarEvents.authorizationStatus()
    console.log('calendar status', status)
    if (status !== 'authorized') {
      const reqStatus = yield RNCalendarEvents.authorizeEventStore()
      console.log('calendar status after ask permissions', reqStatus)
      if (reqStatus === 'authorized') {
        yield addEvent(event)
      }
    } else {
      yield addEvent(event)
    }
  } catch (e) {
    console.log('caledar error', e)
  }
}

export function addCalendarEvent (event) {
  co(start(event))
}

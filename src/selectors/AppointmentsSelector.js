import { createSelector } from 'reselect'
import * as _ from 'lodash'
import moment from 'moment'

const getUser = (state, props) => state.user

export function getPast (user) {
//  console.log('-------> get scheduled is called')
  const res = []
  const timeNowUnix = moment().unix()
  // console.log('timeNowUnix', timeNowUnix)
  if (_.has(user, 'curPacks')) {
    // console.log('user has curPacks')
    for (let p in user.curPacks) {
      const pack = user.curPacks[p]
      // console.log('process pack', pack)
      if (_.has(pack, 'bookings')) {
        // console.log('pack has bookings')
        for (let bId in pack.bookings) {
          const b = pack.bookings[bId]
          // console.log('process booking', b)
          const bTime = moment(b.booking)
          // console.log('bTime.unix', bTime.unix(), 'timeNowUnix', timeNowUnix)
          if (bTime.unix() <= timeNowUnix) {
            const booking = _.assign({}, b)
            booking.id = bId
            res.push(booking)
          }
        }
      }
    }
  }
  // console.log('-------> get scheduled returned', res)
  const sortedRes = _.sortBy(res, (o) => o.booking)
  return _.reverse(sortedRes)
}


export function getScheduled (user) {
//  console.log('-------> get scheduled is called')
  const res = []
  const timeNowUnix = moment().unix()
  // console.log('timeNowUnix', timeNowUnix)
  if (_.has(user, 'curPacks')) {
    // console.log('user has curPacks')
    for (let p in user.curPacks) {
      const pack = user.curPacks[p]
      // console.log('process pack', pack)
      if (_.has(pack, 'bookings')) {
        // console.log('pack has bookings')
        for (let bId in pack.bookings) {
          const b = pack.bookings[bId]
          // console.log('process booking', b)
          const bTime = moment(b.booking)
          // console.log('bTime.unix', bTime.unix(), 'timeNowUnix', timeNowUnix)
          if (bTime.unix() > timeNowUnix) {
            const booking = _.assign({}, b)
            booking.id = bId
            res.push(booking)
          }
        }
      }
    }
  }
  // console.log('-------> get scheduled returned', res)
  const sortedRes = _.sortBy(res, (o) => o.booking)
  return _.reverse(sortedRes)
}

export const makeGetScheduled = () =>
  createSelector(
    [ getUser ],
    (user) => {
      // console.log('-------> scheduled selector is called')
      return getScheduled(user)
    }
  )

import { createSelector } from 'reselect'
import * as _ from 'lodash'

const getUser = (state, props) => state.user

const makeGetBlowoutsCount = () =>
  createSelector(
    [ getUser ],
    (user) => {
      let cnt = 0
      if (_.has(user, 'curPacks')) {
        for (let p in user.curPacks) {
          const pack = user.curPacks[p]
          if (pack.expiryTime > _.now()) {
            cnt += parseInt(user.curPacks[p].curCount, 10)
          }
        }
      }
      if (_.has(user, 'requests')) {
        const reqCount = _.keys(user.requests).length
        cnt -= reqCount
      }
      return cnt
    }
  )

export default makeGetBlowoutsCount

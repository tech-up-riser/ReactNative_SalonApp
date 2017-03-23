import {
  createStore,
  applyMiddleware,
  compose
} from 'redux'
import coMiddleware from 'redux-co'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

console.log('NODE_ENV', process.env.NODE_ENV)

const configureStore = (initialState) => {
  const enhancer = compose(
    applyMiddleware(coMiddleware)
    // (process.env.NODE_ENV === 'development') ? applyMiddleware(coMiddleware, createLogger()) : applyMiddleware(coMiddleware)
  )
  return createStore(rootReducer, initialState, enhancer)
}

export default configureStore

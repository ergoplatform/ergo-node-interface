import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import rootReducer from '../reducers/rootReducer'

export default () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware(),
  })

  return store
}

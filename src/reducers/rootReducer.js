import { combineReducers } from 'redux'
import appSlice from '../slices/appSlice'

export default combineReducers({
  app: appSlice.reducer,
})

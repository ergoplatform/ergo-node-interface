import { combineReducers } from 'redux';
import appSlice from '../slices/appSlice';
import walletSlice from '../slices/walletSlice';

export default combineReducers({
  app: appSlice.reducer,
  wallet: walletSlice.reducer,
});

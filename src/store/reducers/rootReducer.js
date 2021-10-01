import { combineReducers } from 'redux';
import appSlice from '../slices/appSlice';
import nodeSlice from '../slices/nodeSlice';
import walletSlice from '../slices/walletSlice';

export default combineReducers({
  app: appSlice.reducer,
  node: nodeSlice.reducer,
  wallet: walletSlice.reducer,
});

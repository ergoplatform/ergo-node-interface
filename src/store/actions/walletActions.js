import { createAction } from 'redux-starter-kit';
import walletSlice from '../slices/walletSlice';

const checkWalletStatus = createAction('checkWalletStatus');
const getWalletBalance = createAction('getWalletBalance');
const getErgPrice = createAction('getErgPrice');
const getWalletAddresses = createAction('getWalletAddresses');

export default {
  ...walletSlice.actions,
  checkWalletStatus,
  getWalletBalance,
  getErgPrice,
  getWalletAddresses,
};

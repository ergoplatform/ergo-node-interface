import { createAction } from 'redux-starter-kit'
import walletSlice from '../slices/walletSlice'

const checkWalletStatus = createAction('checkWalletStatus')
const getWalletBalance = createAction('getWalletBalance')
const getErgPrice = createAction('getErgPrice')

export default {
  ...walletSlice.actions,
  checkWalletStatus,
  getWalletBalance,
  getErgPrice,
}

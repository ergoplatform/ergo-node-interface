import { createAction } from 'redux-starter-kit'
import walletSlice from '../slices/walletSlice'

const checkWalletStatus = createAction('checkWalletStatus')

export default {
  ...walletSlice.actions,
  checkWalletStatus,
}

import { createSlice } from 'redux-starter-kit'

const initialState = {
  isWalletUnlocked: null,
  isWalletInitialized: null,
  walletStatusData: null,
  walletBalanceData: null,
  ergPrice: null,
}

export default createSlice({
  name: 'walletSlice',
  initialState,
  reducers: {
    setIsWalletUnlocked: (state, { payload }) => {
      state.isWalletUnlocked = payload
    },
    setIsWalletInitialized: (state, { payload }) => {
      state.isWalletInitialized = payload
    },
    setWalletStatusData: (state, { payload }) => {
      state.walletStatusData = payload
    },
    setWalletBalanceData: (state, { payload }) => {
      state.walletBalanceData = payload
    },
    setErgPrice: (state, { payload }) => {
      state.ergPrice = payload
    },
  },
})

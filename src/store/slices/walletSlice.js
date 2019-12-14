import { createSlice } from 'redux-starter-kit'

const initialState = {
  isWalletUnlocked: null,
  isWalletInitialized: null,
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
  },
})

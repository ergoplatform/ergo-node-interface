import { createSelector } from 'redux-starter-kit'

export const walletSelector = state => state.wallet

export const isWalletUnlockedSelector = createSelector(
  walletSelector,
  wallet => wallet.isWalletUnlocked,
)

export const isWalletInitializedSelector = createSelector(
  walletSelector,
  wallet => wallet.isWalletInitialized,
)

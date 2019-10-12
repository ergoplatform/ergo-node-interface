import { createSelector } from 'redux-starter-kit'

export const walletSelector = state => state.wallet

export const isWalletUnlockSelector = createSelector(
  walletSelector,
  wallet => wallet.isWalletUnlockSelector,
)

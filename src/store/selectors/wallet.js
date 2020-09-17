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

export const walletStatusDataSelector = createSelector(
  walletSelector,
  wallet => wallet.walletStatusData,
)

export const walletBalanceDataSelector = createSelector(
  walletSelector,
  wallet => wallet.walletBalanceData,
)

export const ergPriceSelector = createSelector(
  walletSelector,
  wallet => wallet.ergPrice,
)

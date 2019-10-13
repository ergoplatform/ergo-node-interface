import walletActions from '../actions/walletActions'
import nodeApi from '../../api/api'
import { apiKeySelector } from '../selectors/app'

export default store => next => action => {
  const { dispatch, getState } = store
  const apiKey = apiKeySelector(getState())

  switch (action.type) {
    case walletActions.checkWalletStatus.type:
      nodeApi
        .get('/wallet/status', {
          headers: {
            api_key: apiKey,
          },
        })
        .then(({ data: { isUnlocked, isInitialized } }) => {
          dispatch(walletActions.setIsWalletUnlocked(isUnlocked))
          dispatch(walletActions.setIsWalletInitialized(isInitialized))
        })
        .catch(() => {})

      break

    default:
      break
  }
  next(action)
}

import Axios from 'axios';
import walletActions from '../actions/walletActions';
import nodeApi from '../../api/api';
import { apiKeySelector } from '../selectors/app';
import oracleApi from '../../api/oracleApi';

export default (store) => (next) => (action) => {
  const { dispatch, getState } = store;
  const apiKey = apiKeySelector(getState());

  switch (action.type) {
    case walletActions.checkWalletStatus.type:
      nodeApi
        .get('/wallet/status', {
          headers: {
            api_key: apiKey,
          },
        })
        .then(({ data: walletData }) => {
          dispatch(walletActions.setIsWalletUnlocked(walletData.isUnlocked));
          dispatch(walletActions.setIsWalletInitialized(walletData.isInitialized));
          dispatch(walletActions.setWalletStatusData(walletData));
        })
        .catch(() => {});

      break;

    case walletActions.getWalletBalance.type:
      nodeApi
        .get('/wallet/balances', {
          headers: {
            api_key: apiKey,
          },
        })
        .then(({ data: walletData }) => {
          dispatch(walletActions.setWalletBalanceData(walletData));
        })
        .catch(() => {});

      break;

    case walletActions.getErgPrice.type:
      oracleApi
        .get('/frontendData', {
          transformResponse: [...Axios.defaults.transformResponse, (data) => JSON.parse(data)],
        })
        .then(({ data }) => {
          dispatch(walletActions.setErgPrice(data.latest_price));
        })
        .catch(() => {});

      break;

    case walletActions.getWalletAddresses.type:
      nodeApi
        .get('/wallet/addresses', {
          headers: {
            api_key: apiKey,
          },
        })
        .then(({ data: walletAddresses }) => {
          dispatch(walletActions.setWalletAddresses(walletAddresses));
        })
        .catch(() => {});

      break;

    default:
      break;
  }
  next(action);
};

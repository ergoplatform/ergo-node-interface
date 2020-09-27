import React, { useState, useEffect, useCallback, memo } from 'react';
import { connect } from 'react-redux';
import nodeApi from '../../../api/api';
import DashboardView from './DashboardView';
import {
  isWalletInitializedSelector,
  isWalletUnlockedSelector,
  walletStatusDataSelector,
  walletBalanceDataSelector,
  ergPriceSelector,
} from '../../../store/selectors/wallet';
import { apiKeySelector } from '../../../store/selectors/app';
import usePrevious from '../../../hooks/usePrevious';
import walletActions from '../../../store/actions/walletActions';

const mapStateToProps = (state) => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
  isWalletUnlocked: isWalletUnlockedSelector(state),
  walletStatusData: walletStatusDataSelector(state),
  walletBalanceData: walletBalanceDataSelector(state),
  ergPrice: ergPriceSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCheckWalletStatus: () => dispatch(walletActions.checkWalletStatus()),
  dispatchGetWalletBalance: () => dispatch(walletActions.getWalletBalance()),
  dispatchGetErgPrice: () => dispatch(walletActions.getErgPrice()),
});

const DashboardContainer = (props) => {
  const {
    isWalletInitialized,
    isWalletUnlocked,
    apiKey,
    dispatchCheckWalletStatus,
    dispatchGetWalletBalance,
    dispatchGetErgPrice,
    walletStatusData,
    walletBalanceData,
    ergPrice,
  } = props;

  const [nodeInfo, setNodeInfo] = useState(null);
  const [error, setError] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const getNodeCurrentState = () => nodeApi.get('/info');

  const setNodeCurrentState = useCallback(async () => {
    try {
      const { data } = await getNodeCurrentState();

      setNodeInfo(data);
      setError(null);
    } catch {
      setError('Node connection is lost.');
    }
  }, []);

  const setTimer = useCallback(() => {
    const newTimerId = setInterval(() => {
      setNodeCurrentState();
      dispatchGetErgPrice();

      if (apiKey) {
        dispatchCheckWalletStatus();
        dispatchGetWalletBalance();
      }
    }, 2000);

    setTimerId(newTimerId);
  }, [
    apiKey,
    dispatchCheckWalletStatus,
    dispatchGetErgPrice,
    dispatchGetWalletBalance,
    setNodeCurrentState,
  ]);

  const prevError = usePrevious(error);
  useEffect(() => {
    if (prevError && prevError !== error) {
      dispatchCheckWalletStatus();
      dispatchGetWalletBalance();
      dispatchGetErgPrice();
    }
  }, [dispatchCheckWalletStatus, dispatchGetErgPrice, dispatchGetWalletBalance, error, prevError]);

  useEffect(() => {
    setNodeCurrentState();
    dispatchGetErgPrice();

    if (apiKey) {
      dispatchCheckWalletStatus();
      dispatchGetWalletBalance();
    }

    setTimer();
    // eslint-disable-next-line
  }, [apiKey]);

  useEffect(
    () => () => {
      clearInterval(timerId);
    },
    [timerId, apiKey],
  );

  return (
    <DashboardView
      error={error}
      nodeInfo={nodeInfo}
      isWalletInitialized={isWalletInitialized}
      isWalletUnlocked={isWalletUnlocked}
      apiKey={apiKey}
      walletStatusData={walletStatusData}
      walletBalanceData={walletBalanceData}
      ergPrice={ergPrice}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(DashboardContainer));

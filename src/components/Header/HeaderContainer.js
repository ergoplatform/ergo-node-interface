import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { apiKeySelector } from '../../store/selectors/app';
import { isWalletInitializedSelector } from '../../store/selectors/wallet';
import walletActions from '../../store/actions/walletActions';
import HeaderView from './HeaderView';

const mapStateToProps = (state) => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCheckWalletStatus: () => dispatch(walletActions.checkWalletStatus()),
});

const HeaderContainer = (props) => {
  const { apiKey, dispatchCheckWalletStatus, isWalletInitialized } = props;

  useEffect(() => {
    if (apiKey !== '') {
      dispatchCheckWalletStatus();
    }
  }, [apiKey, dispatchCheckWalletStatus]);

  const isApiKeySetted = apiKey !== '';

  return <HeaderView isApiKeySetted={isApiKeySetted} isWalletInitialized={isWalletInitialized} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(HeaderContainer));

import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import walletActions from 'store/actions/walletActions';
import PaymentSendForm from './components/PaymentSendForm/index';
import AssetIssueForm from './components/AssetIssueForm/index';
import AssetBurnForm from './components/AssetBurnForm';
import { apiKeySelector } from '../../../store/selectors/app';
import { explorerSelector } from '../../../store/selectors/node';
import {
  isWalletInitializedSelector,
  isWalletUnlockedSelector,
  walletBalanceDataSelector,
} from '../../../store/selectors/wallet';
import WalletInformationTable from './components/WalletInformationTable/index';
import './index.scss';

const mapStateToProps = (state) => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
  isWalletUnlocked: isWalletUnlockedSelector(state),
  walletBalanceData: walletBalanceDataSelector(state),
  explorerSubdomain: explorerSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchGetWalletBalance: () => dispatch(walletActions.getWalletBalance()),
});

class Wallet extends Component {
  renderState = (state) =>
    ({
      unlocked: (apiKey, walletBalanceData, getWalletBalance, explorerSubdomain) =>
        this.renderWalletUnlockedState(
          apiKey,
          walletBalanceData,
          getWalletBalance,
          explorerSubdomain,
        ),
      locked: () => this.renderWalletLockedState(),
      initialized: (apiKey) => this.renderInitializedState(apiKey),
    }[state]);

  renderWalletLockedState = () => (
    <div className="container-fluid pt-4">
      <p>The wallet UI is locked. You need to unlock the wallet to access its UI.</p>
    </div>
  );

  renderInitializedState = () => (
    <div className="container-fluid pt-4">
      <p>You need to initialize your wallet to access wallet UI.</p>
    </div>
  );

  renderWalletUnlockedState = (
    apiKey,
    walletBalanceData,
    dispatchGetWalletBalance,
    explorerSubdomain,
  ) => (
    <div className="wallet-container">
      <div>
        <WalletInformationTable />
      </div>
      <div>
        <PaymentSendForm
          apiKey={apiKey}
          walletBalanceData={walletBalanceData}
          getWalletBalance={dispatchGetWalletBalance}
          explorerSubdomain={explorerSubdomain}
        />
      </div>
      <div>
        <AssetIssueForm
          apiKey={apiKey}
          getWalletBalance={dispatchGetWalletBalance}
          explorerSubdomain={explorerSubdomain}
        />
      </div>
      <div>
        <AssetBurnForm
          apiKey={apiKey}
          walletBalanceData={walletBalanceData}
          getWalletBalance={dispatchGetWalletBalance}
          explorerSubdomain={explorerSubdomain}
        />
      </div>
    </div>
  );

  render() {
    const {
      apiKey,
      isWalletUnlocked,
      isWalletInitialized,
      walletBalanceData,
      dispatchGetWalletBalance,
      explorerSubdomain,
    } = this.props;

    if (apiKey === '') {
      return (
        <div className="container-fluid pt-4">
          <p>To continue, please set your API key.</p>
        </div>
      );
    }

    if (!isWalletInitialized) {
      return this.renderState('initialized')(apiKey);
    }

    if (isWalletUnlocked) {
      return this.renderState('unlocked')(
        apiKey,
        walletBalanceData,
        dispatchGetWalletBalance,
        explorerSubdomain,
      );
    }

    return this.renderState('locked')();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(Wallet));

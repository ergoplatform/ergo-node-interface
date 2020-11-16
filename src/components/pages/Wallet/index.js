import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import PaymentSendForm from './components/PaymentSendForm/index';
import { apiKeySelector } from '../../../store/selectors/app';
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
});

class Wallet extends Component {
  renderState = (state) =>
    ({
      unlocked: (apiKey, walletBalanceData) =>
        this.renderWalletUnlockedState(apiKey, walletBalanceData),
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

  renderWalletUnlockedState = (apiKey, walletBalanceData) => (
    <div className="wallet-container">
      <div>
        <WalletInformationTable />
      </div>
      <div>
        <PaymentSendForm apiKey={apiKey} walletBalanceData={walletBalanceData} />
      </div>
      {/* <GetBalanceForm apiKey={apiKey} />
        <GetWalletAddressesForm apiKey={apiKey} /> */}
    </div>
  );

  render() {
    const { apiKey, isWalletUnlocked, isWalletInitialized, walletBalanceData } = this.props;

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
      return this.renderState('unlocked')(apiKey, walletBalanceData);
    }

    return this.renderState('locked')();
  }
}

export default connect(mapStateToProps)(memo(Wallet));

import React, { Component, memo } from 'react'
import { connect } from 'react-redux'
import PaymentSendForm from './components/PaymentSendForm'
import GetBalanceForm from './components/GetBalanceForm'
import GetWalletAddressesForm from './components/GetWalletAddressesForm'
import { apiKeySelector } from '../../../store/selectors/app'
import {
  isWalletInitializedSelector,
  isWalletUnlockedSelector,
} from '../../../store/selectors/wallet'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
  isWalletUnlocked: isWalletUnlockedSelector(state),
})

class Wallet extends Component {
  renderState = state =>
    ({
      unlocked: apiKey => this.renderWalletUnlockedState(apiKey),
      locked: () => this.renderWalletLockedState(),
      initialized: apiKey => this.renderInitializedState(apiKey),
    }[state])

  renderWalletUnlockedState = apiKey => (
    <div className="container-fluid pt-4">
      <div className="row">
        <PaymentSendForm apiKey={apiKey} />
        <GetBalanceForm apiKey={apiKey} />
        <GetWalletAddressesForm apiKey={apiKey} />
      </div>
    </div>
  )

  renderWalletLockedState = () => (
    <div className="container-fluid pt-4">
      <p>
        The wallet UI is locked. You need to unlock the wallet to access its UI.
      </p>
    </div>
  )

  renderInitializedState = () => (
    <div className="container-fluid pt-4">
      <p>You need to initialize your wallet to access wallet UI.</p>
    </div>
  )

  render() {
    const { apiKey, isWalletUnlocked, isWalletInitialized } = this.props

    if (apiKey === '') {
      return (
        <div className="container-fluid pt-4">
          <p>For continue need to set API key.</p>
        </div>
      )
    }

    if (!isWalletInitialized) {
      return this.renderState('initialized')(apiKey)
    }

    if (isWalletUnlocked) {
      return this.renderState('unlocked')(apiKey)
    }

    return this.renderState('locked')()
  }
}

export default connect(mapStateToProps)(memo(Wallet))

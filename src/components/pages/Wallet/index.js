import React, { Component, memo } from 'react'
import { connect } from 'react-redux'
import { ApiKeyContext } from '../../../context/context'
import WalletInitializeForm from '../../elements/wallet/WalletInitializeForm'
import RestoreWalletForm from '../../elements/wallet/RestoreWalletForm'
import PaymentSendForm from '../../elements/wallet/PaymentSendForm'
import GetBalanceForm from '../../elements/wallet/GetBalanceForm'
import GetWalletAddressesForm from '../../elements/wallet/GetWalletAddressesForm'
import { apiKeySelector } from '../../../selectors/app'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
})

class Wallet extends Component {
  static contextType = ApiKeyContext

  render() {
    const { apiKey } = this.props

    if (apiKey === '') {
      return (
        <div className="container-fluid pt-4">
          <p>For continue need to set API key.</p>
        </div>
      )
    }

    return (
      <div className="container-fluid pt-4">
        <div className="row">
          <WalletInitializeForm />
          <RestoreWalletForm />
          <GetBalanceForm />
          <GetWalletAddressesForm />
          <PaymentSendForm />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(memo(Wallet))

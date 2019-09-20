import React, { Component } from 'react'
import { ApiKeyContext } from '../../../context/context'
import WalletInitializeForm from '../../elements/wallet/WalletInitializeForm'
import RestoreWalletForm from '../../elements/wallet/RestoreWalletForm'
import PaymentSendForm from '../../elements/wallet/PaymentSendForm'
import GetBalanceForm from '../../elements/wallet/GetBalanceForm'
import GetWalletAddressesForm from '../../elements/wallet/GetWalletAddressesForm'

class Wallet extends Component {
  static contextType = ApiKeyContext

  render() {
    if (this.context.value === '') {
      return (
        <div className="container-fluid mt-4">
          <p>For continue need to set API key.</p>
        </div>
      )
    }

    return (
      <div className="container-fluid mt-4">
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

export default Wallet

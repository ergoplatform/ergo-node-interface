import React, { Component } from 'react'
import { ApiKeyContext } from '../../../context/context'
import WalletInitializeForm from '../../elements/WalletInitializeForm'

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
        </div>
      </div>
    )
  }
}

export default Wallet

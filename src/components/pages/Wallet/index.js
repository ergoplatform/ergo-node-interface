import React, { Component } from 'react'
import PaymentSendForm from '../../elements/PaymentSendForm'
import { ApiKeyContext } from '../../../context/context'

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
          <PaymentSendForm />
        </div>
      </div>
    )
  }
}

export default Wallet

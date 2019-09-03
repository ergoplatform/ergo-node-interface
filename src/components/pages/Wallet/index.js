import React, { Component } from 'react'
import PaymentSendForm from '../../elements/PaymentSendForm'

export default class Wallet extends Component {
  render() {
    return (
      <div className="container-fluid mt-4">
        <div className="row">
          <PaymentSendForm />
        </div>
      </div>
    )
  }
}

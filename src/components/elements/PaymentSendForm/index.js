import React, { Component } from 'react'

export class PaymentSendForm extends Component {
  render() {
    return (
      <div className="col-4">
        <form className="card bg-white p-4">
          <h2 className="h5 mb-3">Payment Send Form</h2>
          <div className="form-group">
            <label for="apiKeyInput">API key</label>
            <input
              type="text"
              className="form-control"
              id="apiKeyInput"
              aria-describedby="apiKey"
              placeholder="Enter API key"
            />
            <small id="apiKeyHelp" className="form-text text-muted">
              Enter api key here, <b>not api key hash</b>
            </small>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Wallet password *</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
            <small id="apiKeyHelp" className="form-text text-muted">
              * If you have it <b>or leave field empty</b>
            </small>
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Recipient address</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter recipient address"
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Amount</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter amount"
            />
          </div>
          {/* <div className="form-group">
            <label for="exampleInputPassword1">Fee *</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputPassword1"
              value="1000000"
            />
            <small id="apiKeyHelp" className="form-text text-muted">
              <b>* Optional. Default 1.000.000 mErgs</b>
            </small>
          </div> */}
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    )
  }
}

export default PaymentSendForm

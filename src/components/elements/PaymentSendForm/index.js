import React, { Component } from 'react'
import { Formik, Field, Form } from 'formik'
import { successToast } from '../../../utils/toast'
import nodeApi from '../../../api/api'

class PaymentSendForm extends Component {
  paymentSend = async () => {
    await nodeApi.post(
      '/wallet/unlock',
      {},
      {
        headers: {
          api_key: '',
        },
      },
    )
  }

  render() {
    return (
      <div className="col-4">
        <div className="card bg-white p-4">
          <h2 className="h5 mb-3">Payment Send Form</h2>
          <Formik
            initialValues={{
              apiKey: '',
              walletPassword: '',
              recipientAddress: '',
              amount: 0,
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (window.confirm('Are you sure ?')) {
                this.paymentSend()
                successToast('Sended')
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="api-key-input">API key</label>
                  <Field
                    name="apiKey"
                    type="text"
                    id="api-key-input"
                    className="form-control"
                    aria-describedby="apiKey"
                    placeholder="Enter API key"
                  />
                  <small id="apiKeyHelp" className="form-text text-muted">
                    Enter api key here, <b>not api key hash</b>
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="wallet-password-input">
                    Wallet password *
                  </label>
                  <Field
                    name="walletPassword"
                    type="password"
                    id="wallet-password-input"
                    className="form-control"
                    placeholder="Enter wallet password"
                  />
                  <small
                    id="walletPasswordHelp"
                    className="form-text text-muted"
                  >
                    * If you have it <b>or leave field empty</b>
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-address">Recipient address</label>
                  <Field
                    type="text"
                    name="recipientAddress"
                    id="recipient-address-input"
                    className="form-control"
                    placeholder="Enter recipient address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <Field
                    type="text"
                    name="amount"
                    id="amount-input"
                    className="form-control"
                    placeholder="Enter amount"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Send
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }
}

export default PaymentSendForm

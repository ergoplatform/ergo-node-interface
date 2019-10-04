import React, { PureComponent } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../../api/api'
import { ApiKeyContext } from '../../../../context/context'
import customToast from '../../../../utils/toast'
import CopyToClipboard from '../../../common/CopyToClipboard'
import constants from '../../../../utils/constants'

const initialFormValues = {
  pass: '',
  recipientAddress: '',
  amount: '',
}

class PaymentSendForm extends PureComponent {
  static contextType = ApiKeyContext

  state = {
    isShowTransactionId: false,
  }

  paymentSend = async ({ pass, recipientAddress, amount }) => {
    await nodeApi.post(
      '/wallet/unlock',
      { pass },
      {
        headers: {
          api_key: this.context.value,
        },
      },
    )

    const data = await nodeApi.post(
      '/wallet/payment/send',
      [
        {
          address: recipientAddress,
          value: Number(amount * constants.nanoErgInErg),
        },
      ],
      {
        headers: {
          api_key: this.context.value,
        },
      },
    )

    await nodeApi.get('/wallet/lock', {
      headers: {
        api_key: this.context.value,
      },
    })

    return data
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.paymentSend(values)
      .then(({ data }) => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: (
            <>
              Your payment successfully sent. Your transaction ID -{' '}
              <CopyToClipboard>{data}</CopyToClipboard>
            </>
          ),
        })
        this.setState({ isShowTransactionId: true })
      })
      .catch(err => {
        const errMessage = err.data ? err.data.detail : err.message
        customToast('error', errMessage)
        setSubmitting(false)
      })
  }

  render() {
    return (
      <div className="col-4">
        <div className="card bg-white p-4 mb-4">
          <h2 className="h5 mb-3">Payment Send</h2>
          <Formik
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status &&
                  status.state === 'success' &&
                  this.state.isShowTransactionId && (
                    <div className="alert alert-success alert-dismissible">
                      <button
                        type="button"
                        className="close"
                        onClick={() =>
                          this.setState({ isShowTransactionId: false })
                        }
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                      {status.msg}
                    </div>
                  )}
                <div className="form-group">
                  <label htmlFor="wallet-password-input">
                    Wallet password *
                  </label>
                  <Field
                    name="pass"
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
                    placeholder="Minimum 0.001 ERG"
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

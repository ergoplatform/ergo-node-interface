import React, { PureComponent } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../../../api/api'
import customToast from '../../../../../utils/toast'
import CopyToClipboard from '../../../../common/CopyToClipboard'
import constants from '../../../../../utils/constants'

const initialFormValues = {
  recipientAddress: '',
  amount: '',
}

class PaymentSendForm extends PureComponent {
  state = {
    isShowTransactionId: false,
  }

  paymentSend = ({ recipientAddress, amount }) =>
    nodeApi.post(
      '/wallet/payment/send',
      [
        {
          address: recipientAddress,
          value: Number(
            (parseFloat(amount) * constants.nanoErgInErg).toFixed(1),
          ),
        },
      ],
      {
        headers: {
          api_key: this.props.apiKey,
        },
      },
    )

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.paymentSend(values)
      .then(({ data }) => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: (
            <>
              <p>
                Your payment has been sent successfully. The transaction ID is -{' '}
                <CopyToClipboard>{data}</CopyToClipboard>
              </p>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://explorer.ergoplatform.com/en/transactions/${data}`}
                >
                  Click Here To Go To The Explorer
                </a>
              </p>
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
          <h2 className="h5 mb-3">Payment send</h2>
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

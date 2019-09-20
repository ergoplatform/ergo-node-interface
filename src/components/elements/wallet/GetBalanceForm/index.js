import React, { PureComponent } from 'react'
import { Formik, Field, Form } from 'formik'
import NumberFormat from 'react-number-format'
import nodeApi from '../../../../api/api'
import { ApiKeyContext } from '../../../../context/context'
import customToast from '../../../../utils/toast'

const initialFormValues = {
  walletPassword: '',
}

class GetBalanceForm extends PureComponent {
  static contextType = ApiKeyContext

  state = {
    isShowBalance: false,
  }

  getBalance = async ({ walletPassword }) => {
    await nodeApi.post(
      '/wallet/unlock',
      { pass: walletPassword },
      {
        headers: {
          api_key: this.context.value,
        },
      },
    )

    const balance = await nodeApi.get('/wallet/balances', {
      headers: {
        api_key: this.context.value,
      },
    })

    await nodeApi.get('/wallet/lock', {
      headers: {
        api_key: this.context.value,
      },
    })

    return balance
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.getBalance(values)
      .then(({ data: { balance } }) => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: (
            <>
              Your wallet balance -{' '}
              <NumberFormat
                value={(balance / 1000000000).toFixed(8)}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' ERG'}
                className="font-weight-bold"
              />
            </>
          ),
        })
        this.setState({ isShowBalance: true })
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
          <h2 className="h5 mb-3">Get confirmed wallet balance</h2>
          <Formik
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status &&
                  status.state === 'success' &&
                  this.state.isShowBalance && (
                    <div className="alert alert-info alert-dismissible">
                      <button
                        type="button"
                        className="close"
                        onClick={() => this.setState({ isShowBalance: false })}
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

export default GetBalanceForm

import React, { PureComponent } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../../api/api'
import { ApiKeyContext } from '../../../../context/context'
import customToast from '../../../../utils/toast'
import CopyToClipboard from '../../../common/CopyToClipboard'

const initialFormValues = {
  walletPassword: '',
}

class GetWalletAddressesForm extends PureComponent {
  static contextType = ApiKeyContext

  state = {
    isShowWalletAddresses: false,
  }

  getWalletAddresses = async ({ walletPassword }) => {
    await nodeApi.post(
      '/wallet/unlock',
      { pass: walletPassword },
      {
        headers: {
          api_key: this.context.value,
        },
      },
    )

    const walletAddresses = await nodeApi.get('/wallet/addresses', {
      headers: {
        api_key: this.context.value,
      },
    })

    const walletMinerAddress = await nodeApi.get('/mining/rewardAddress', {
      headers: {
        api_key: this.context.value,
      },
    })

    await nodeApi.get('/wallet/lock', {
      headers: {
        api_key: this.context.value,
      },
    })

    return [walletAddresses, walletMinerAddress]
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.getWalletAddresses(values)
      .then(([{ data: walletAddresses }, { data: { rewardAddress } }]) => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: (
            <>
              <p className="mb-1">Wallet Addresses:</p>
              <ul className="mb-3">
                {walletAddresses.map(addr => (
                  <>
                    <li className="mb-1">
                      <CopyToClipboard>{addr}</CopyToClipboard>
                    </li>
                  </>
                ))}
              </ul>
              <p>
                Miner Address -{' '}
                <CopyToClipboard>{rewardAddress}</CopyToClipboard>
              </p>
            </>
          ),
        })
        this.setState({ isShowWalletAddresses: true })
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
          <h2 className="h5 mb-3">Get all wallet addresses (with miner)</h2>
          <Formik
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status &&
                  status.state === 'success' &&
                  this.state.isShowWalletAddresses && (
                    <div className="alert alert-info alert-dismissible">
                      <button
                        type="button"
                        className="close"
                        onClick={() =>
                          this.setState({ isShowWalletAddresses: false })
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

export default GetWalletAddressesForm

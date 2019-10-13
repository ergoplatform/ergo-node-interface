import React, { Component, memo } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../../api/api'
import CopyToClipboard from '../../../common/CopyToClipboard'
import customToast from '../../../../utils/toast'

const initialFormValues = {
  walletPassword: '',
  mnemonicPass: '',
}

class WalletInitializeForm extends Component {
  state = { isShowMnemonic: false }

  walletInit = async ({ walletPassword, mnemonicPass }) => {
    const { data } = await nodeApi.post(
      '/wallet/init',
      { pass: walletPassword, mnemonicPass },
      {
        headers: {
          api_key: this.props.apiKey,
        },
      },
    )

    return data
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.walletInit(values)
      .then(result => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: (
            <>
              Your wallet successfully initialized. Please, save your mnemonic -{' '}
              <CopyToClipboard>{result.mnemonic}</CopyToClipboard>
            </>
          ),
        })
        this.setState({ isShowMnemonic: true })
      })
      .catch(err => {
        const errMessage = err.data ? err.data.detail : err.message
        customToast('error', errMessage)
        setSubmitting(false)
      })
  }

  render() {
    return (
      <div className="card bg-white p-4 mb-4">
        <h2 className="h5 mb-3">Initialize wallet</h2>
        <Formik initialValues={initialFormValues} onSubmit={this.handleSubmit}>
          {({ status, isSubmitting }) => (
            <Form>
              {status && status.state === 'error' && (
                <div className="alert alert-danger" role="alert">
                  {status.msg}
                </div>
              )}
              {status &&
                status.state === 'success' &&
                this.state.isShowMnemonic && (
                  <div className="alert alert-success alert-dismissible">
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.setState({ isShowMnemonic: false })}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    {status.msg}
                  </div>
                )}
              <div className="form-group">
                <label htmlFor="wallet-password-input">Wallet password</label>
                <Field
                  name="walletPassword"
                  type="password"
                  id="wallet-password-input"
                  className="form-control"
                  placeholder="Enter wallet password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mnemonic-password-input">
                  Mnemonic password
                </label>
                <Field
                  name="mnemonicPass"
                  type="password"
                  id="mnemonic-password-input"
                  className="form-control"
                  placeholder="Enter mnemonic password"
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
    )
  }
}

export default memo(WalletInitializeForm)

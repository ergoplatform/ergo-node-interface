import React, { Component } from 'react'
import { Formik, Field, Form } from 'formik'
import nodeApi from '../../../api/api'
import { ApiKeyContext } from '../../../context/context'
import CopyToClipboard from '../../common/CopyToClipboard'
import customToast from '../../../utils/toast'

const initialFormValues = {
  pass: '',
  mnemonicPass: '',
}

class WalletInitializeForm extends Component {
  static contextType = ApiKeyContext

  walletInit = async values => {
    const { data } = await nodeApi.post('/wallet/init', values, {
      headers: {
        api_key: this.context.value,
      },
    })

    return data
  }

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.walletInit(values)
      .then(result => {
        resetForm(initialFormValues)
        setStatus({
          state: 'success',
          msg: `Your wallet success initialized. Please, save your mnemonic - ${(
            <CopyToClipboard>{result.mnemonic}</CopyToClipboard>
          )}`,
        })
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
        <div className="card bg-white p-4">
          <h2 className="h5 mb-3">Initialize Wallet</h2>
          <Formik
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status && status.state === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    {status.msg}
                  </div>
                )}
                {status && status.state === 'success' && (
                  <div className="alert alert-success">{status.msg}</div>
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
      </div>
    )
  }
}

export default WalletInitializeForm

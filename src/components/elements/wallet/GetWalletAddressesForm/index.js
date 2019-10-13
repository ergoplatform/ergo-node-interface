import React, { PureComponent } from 'react'
import { Formik, Form } from 'formik'
import nodeApi from '../../../../api/api'
import customToast from '../../../../utils/toast'
import CopyToClipboard from '../../../common/CopyToClipboard'

class GetWalletAddressesForm extends PureComponent {
  state = {
    isShowWalletAddresses: false,
  }

  getWalletAddresses = () =>
    nodeApi.get('/wallet/addresses', {
      headers: {
        api_key: this.props.apiKey,
      },
    })

  handleSubmit = (values, { setSubmitting, setStatus }) => {
    setStatus({ status: 'submitting' })
    this.getWalletAddresses(values)
      .then(({ data: walletAddresses }) => {
        setStatus({
          state: 'success',
          msg: (
            <>
              <p className="mb-1">Wallet Addresses:</p>
              <ul className="mb-3">
                {walletAddresses.map(addr => (
                  <li className="mb-1" key={addr}>
                    <CopyToClipboard>{addr}</CopyToClipboard>
                  </li>
                ))}
              </ul>
            </>
          ),
        })
        this.setState({ isShowWalletAddresses: true })
        setSubmitting(false)
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
          <h2 className="h5 mb-3">Get all wallet addresses</h2>
          <Formik onSubmit={this.handleSubmit}>
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
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Get
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

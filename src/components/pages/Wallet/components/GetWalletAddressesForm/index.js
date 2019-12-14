import React, { PureComponent } from 'react'
import nodeApi from '../../../../../api/api'
import customToast from '../../../../../utils/toast'
import CopyToClipboard from '../../../../common/CopyToClipboard'

class GetWalletAddressesForm extends PureComponent {
  state = {
    isShowWalletAddresses: false,
    walletAddresses: [],
  }

  getWalletAddresses = () =>
    nodeApi.get('/wallet/addresses', {
      headers: {
        api_key: this.props.apiKey,
      },
    })

  handleSubmit = event => {
    event.preventDefault()

    this.getWalletAddresses()
      .then(({ data: walletAddresses }) => {
        this.setState({ isShowWalletAddresses: true, walletAddresses })
      })
      .catch(err => {
        const errMessage = err.data ? err.data.detail : err.message
        customToast('error', errMessage)
      })
  }

  render() {
    return (
      <div className="col-4">
        <div className="card bg-white p-4 mb-4">
          <h2 className="h5 mb-3">Get all wallet addresses</h2>
          <form onSubmit={this.handleSubmit}>
            {this.state.isShowWalletAddresses && (
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
                <p className="mb-1">Wallet Addresses:</p>
                <ul className="mb-3">
                  {this.state.walletAddresses.map(addr => (
                    <li className="mb-1" key={addr}>
                      <CopyToClipboard>{addr}</CopyToClipboard>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              Get
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default GetWalletAddressesForm

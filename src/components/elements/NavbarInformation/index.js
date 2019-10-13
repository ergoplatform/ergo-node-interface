import React, { Component, memo } from 'react'
import { connect } from 'react-redux'
import ApiKeyModal from '../ApiKeyModal'
import WalletStatusModal from '../WalletStatusModal'
import { apiKeySelector } from '../../../store/selectors/app'
import { isWalletInitializedSelector } from '../../../store/selectors/wallet'
import WalletInitModal from '../WalletInitModal'
import walletActions from '../../../store/actions/walletActions'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
})

const mapDispatchToProps = dispatch => ({
  dispatchCheckWalletStatus: () => dispatch(walletActions.checkWalletStatus()),
})

class NavbarInformation extends Component {
  renderWalletForms = () => {
    if (this.props.isWalletInitialized === null) {
      return <></>
    }

    if (this.props.isWalletInitialized) {
      return (
        <div className="ml-4">
          <WalletStatusModal />
        </div>
      )
    }

    return (
      <div className="ml-4">
        <WalletInitModal />
      </div>
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.apiKey !== '' && prevProps.apiKey !== this.props.apiKey) {
      this.props.dispatchCheckWalletStatus()
    }
  }

  render() {
    const isApiKeySetted = this.props.apiKey !== ''

    return (
      <>
        <div className="ml-4">
          <ApiKeyModal />
        </div>
        {isApiKeySetted && this.renderWalletForms()}
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(NavbarInformation))

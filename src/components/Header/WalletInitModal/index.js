import React, { Component, memo } from 'react'
import Modal from 'react-bootstrap/Modal'
import { connect } from 'react-redux'
import { apiKeySelector } from '../../../store/selectors/app'
import appActions from '../../../store/actions/appActions'
import WalletInitializeForm from '../../elements/WalletInitializeForm'
import RestoreWalletForm from '../../elements/RestoreWalletForm'
import walletActions from '../../../store/actions/walletActions'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
})

const mapDispatchToProps = dispatch => ({
  dispatchCheckWalletStatus: () => dispatch(walletActions.checkWalletStatus()),
  dispatchSetApiKey: apiKey => dispatch(appActions.setApiKey(apiKey)),
})

class WalletInitModal extends Component {
  state = {
    showModal: false,
  }

  handleShow = () => {
    this.setState({ showModal: true })
  }

  handleHide = () => {
    this.props.dispatchCheckWalletStatus()
    this.setState({ showModal: false })
  }

  renderButton = () => {
    return (
      <button onClick={this.handleShow} className="btn btn-primary">
        Initialize wallet
      </button>
    )
  }

  render() {
    const { apiKey } = this.props

    return (
      <div>
        {this.renderButton()}
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleHide()}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Wallet initialization
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="row">
            <div className="col-6">
              <WalletInitializeForm apiKey={apiKey} />
            </div>
            <div className="col-6">
              <RestoreWalletForm apiKey={apiKey} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-outline-secondary"
              onClick={this.handleHide}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(WalletInitModal))

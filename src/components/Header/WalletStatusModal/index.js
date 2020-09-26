import React, { Component, memo } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Formik, Field, Form } from 'formik';
import { connect } from 'react-redux';
import { isWalletUnlockedSelector } from '../../../store/selectors/wallet';
import walletActions from '../../../store/actions/walletActions';
import { apiKeySelector } from '../../../store/selectors/app';
import customToast from '../../../utils/toast';
import nodeApi from '../../../api/api';

const mapStateToProps = (state) => ({
  isWalletUnlocked: isWalletUnlockedSelector(state),
  apiKey: apiKeySelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetIsWalletUnlocked: (isWalletUnlock) =>
    dispatch(walletActions.setIsWalletUnlocked(isWalletUnlock)),
});

class WalletStatusForm extends Component {
  state = {
    showModal: false,
  };

  handleShow = () => {
    this.setState({ showModal: true });
  };

  handleHide = () => {
    this.setState({ showModal: false });
  };

  walletUnlock = (pass) =>
    nodeApi.post(
      '/wallet/unlock',
      { pass },
      {
        headers: {
          api_key: this.props.apiKey,
        },
      }
    );

  walletLock = () =>
    nodeApi.get('/wallet/lock', {
      headers: {
        api_key: this.props.apiKey,
      },
    });

  submitWalletUnlockForm = (
    { pass },
    { setSubmitting, resetForm, setStatus }
  ) => {
    setStatus({ status: 'submitting' });
    this.walletUnlock(pass)
      .then(() => {
        resetForm({ pass: '' });
        customToast('success', 'Your wallet is unlocked successfully');
        this.props.dispatchSetIsWalletUnlocked(true);
        this.handleHide();
      })
      .catch((err) => {
        const errMessage = err.data ? err.data.detail : err.message;
        customToast('error', errMessage);
        setSubmitting(false);
      });
  };

  submitWalletLockForm = () => {
    // eslint-disable-next-line
    if (confirm('Are you sure want to lock wallet?')) {
      this.walletLock()
        .then(() => {
          customToast('success', 'Your wallet is locked successfully');
          this.props.dispatchSetIsWalletUnlocked(false);
        })
        .catch((err) => {
          const errMessage = err.data ? err.data.detail : err.message;
          customToast('error', errMessage);
        });
    }
  };

  renderButton = () => {
    if (!this.props.isWalletUnlocked) {
      return (
        <button onClick={this.handleShow} className="btn btn-info">
          Unlock wallet
        </button>
      );
    }

    return (
      <button
        onClick={this.submitWalletLockForm}
        className="btn btn-outline-info"
      >
        Lock wallet
      </button>
    );
  };

  render() {
    return (
      <div>
        {this.renderButton()}
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleHide()}
          centered
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Formik
            initialValues={{ pass: '' }}
            onSubmit={this.submitWalletUnlockForm}
          >
            {({ isSubmitting }) => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title id="example-custom-modal-styling-title">
                    Unlock wallet form
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>

                <Modal.Footer>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={this.handleHide}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Save changes
                  </button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(WalletStatusForm));

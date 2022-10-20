import React, { Component, memo } from 'react';
import { Formik, Field, Form } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import nodeApi from '../../../api/api';
import customToast from '../../../utils/toast';

const initialFormValues = {
  walletPassword: '',
  mnemonicPass: '',
  mnemonic: '',
};

class RestoreWalletForm extends Component {
  walletRestore = async (values, uuid) => {
    const {
      walletPassword,
      previousDerivationPath: usePre1627KeyDerivation,
      mnemonicPass = '',
    } = values;
    if (!values[`mnemonic${uuid}`] || !String(values[`mnemonic${uuid}`]).trim()) {
      throw Error('Need to set mnemonic');
    }

    return nodeApi.post(
      '/wallet/restore',
      {
        pass: walletPassword || '',
        mnemonicPass: mnemonicPass || '',
        mnemonic: values[`mnemonic${uuid}`],
        usePre1627KeyDerivation,
      },
      {
        headers: {
          api_key: this.props.apiKey,
        },
      },
    );
  };

  handleSubmit = (values, { setSubmitting, resetForm, setStatus }, uuid) => {
    setStatus({ status: 'submitting' });
    this.walletRestore(values, uuid)
      .then(() => {
        resetForm(initialFormValues);
        customToast('success', 'Your wallet successfully re-stored');
      })
      .catch((err) => {
        const errMessage = err.data ? err.data.detail : err.message;
        customToast('error', errMessage);
        setSubmitting(false);
      });
  };

  render() {
    const uuid = uuidv4();

    return (
      <div className="card bg-white p-4 mb-4">
        <h2 className="h5 mb-3">Re-store wallet</h2>
        <Formik
          initialValues={{
            walletPassword: '',
            mnemonicPass: '',
            [`mnemonic${uuid}`]: '',
            previousDerivationPath: true,
          }}
          onSubmit={(values, props) => this.handleSubmit(values, props, uuid)}
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
                <label htmlFor="restore-mnemonic-input">Mnemonic</label>
                <Field
                  name={`mnemonic${uuid}`}
                  type="text"
                  id="restore-mnemonic-input"
                  className="form-control"
                  placeholder="Enter mnemonic"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="restore-wallet-password-input">Wallet password</label>
                <Field
                  name="walletPassword"
                  type="password"
                  id="restore-wallet-password-input"
                  className="form-control"
                  placeholder="Enter wallet password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="restore-mnemonic-password-input">Mnemonic password</label>
                <Field
                  name="mnemonicPass"
                  type="password"
                  id="restore-mnemonic-password-input"
                  className="form-control"
                  placeholder="Enter mnemonic password"
                />
              </div>
              <div className="form-check">
                <label htmlFor="previous-derivation-path">
                  <Field
                    name="previousDerivationPath"
                    type="checkbox"
                    id="previous-derivation-path"
                    className="form-check-input"
                  />
                  Use previous derivation path{' '}
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => (
                      <Tooltip id="button-tooltip" {...props}>
                        It&apos;s recommended to set it if the original wallet was created by ergo
                        node before v4.0.24.
                      </Tooltip>
                    )}
                  >
                    <a
                      href="https://github.com/ergoplatform/ergo/issues/1627"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (?)
                    </a>
                  </OverlayTrigger>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Send
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default memo(RestoreWalletForm);

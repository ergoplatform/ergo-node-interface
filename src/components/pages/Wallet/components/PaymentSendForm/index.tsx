import React, { useState, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import InfoModal from 'components/common/InfoModal/InfoModal';
import cn from 'classnames';
import nodeApi from '../../../../../api/api';
import customToast from '../../../../../utils/toast';
import CopyToClipboard from '../../../../common/CopyToClipboard';
import constants from '../../../../../utils/constants';

type Errors = {
  recipientAddress?: string;
  amount?: string;
  fee?: string;
  asset?: string;
  assetAmount?: string;
};

const PaymentSendForm = ({
  apiKey,
  walletBalanceData,
  getWalletBalance,
}: {
  apiKey: string;
  walletBalanceData: any;
  getWalletBalance: any;
}) => {
  const currentBalance = walletBalanceData?.balance;

  const [transactionId, setTransactionId] = useState(null);
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [assetCheckbox, setAssetCheckbox] = useState(false);

  const paymentSend = useCallback(
    ({ recipientAddress, amount, fee, asset, assetAmount }) => {
      const request = {
        address: recipientAddress.trim(),
        value: Number((parseFloat(amount) * constants.nanoErgInErg).toFixed(1)),
        assets:
          assetCheckbox && asset !== 'none' && assetAmount > 0
            ? [{ tokenId: asset, amount: Number(assetAmount) }]
            : [],
      };
      return nodeApi.post(
        '/wallet/transaction/send',
        {
          requests: [request],
          fee: Number((parseFloat(fee) * constants.nanoErgInErg).toFixed(1)),
        },
        {
          headers: {
            api_key: apiKey,
          },
        },
      );
    },
    [assetCheckbox, apiKey],
  );

  const resetForm = (form: any) => {
    form.restart();
    setIsSentModalOpen(false);
  };

  const sendForm = useCallback(
    (values) => {
      if (values.recipientAddress.trim() === '' || !values.recipientAddress) {
        return;
      }

      paymentSend(values)
        .then(({ data }) => {
          setTransactionId(data);
          setIsSentModalOpen(true);
          getWalletBalance();
        })
        .catch((err) => {
          const errMessage = err.data ? err.data.detail : err.message;
          customToast('error', errMessage);
        });
    },
    [paymentSend, getWalletBalance],
  );

  const validateForm = useCallback(
    (values) => {
      const errors: Errors = {};

      const totalFeeAndAmount =
        (Number(values.amount) + Number(values.fee)) * constants.nanoErgInErg;

      if (!values.recipientAddress || values.recipientAddress?.trim() === '') {
        errors.recipientAddress = 'The field cannot be empty';
      }

      if (!values.fee || values.fee < 0.001) {
        errors.fee = 'Minimum 0.001 ERG';
      }

      if (values.asset === 'none') {
        errors.asset = 'You need to choose asset';
      }

      if (
        walletBalanceData &&
        values.assetAmount &&
        values.asset !== 'none' &&
        values.assetAmount > walletBalanceData.assets[values.asset]
      ) {
        errors.assetAmount = `Maximum ${walletBalanceData.assets[values.asset]}`;
      }

      if (assetCheckbox && !values.assetAmount) {
        errors.assetAmount = "The field can't be empty";
      }

      if (currentBalance < totalFeeAndAmount) {
        errors.amount = `Maximum ${Math.abs(
          currentBalance / constants.nanoErgInErg - Number(values.fee),
        )} ERG`;
      }
      if (values.amount < 0) {
        errors.amount = "Amount can't be negative";
      }

      if (currentBalance === 0) {
        errors.amount = 'Your balance is empty';
      }

      if (values.fee < 0) {
        errors.fee = "Fee can't be negative";
      }

      return errors;
    },
    [assetCheckbox, walletBalanceData, currentBalance],
  );

  return (
    <div className="">
      <div className="card bg-white p-4">
        <h2 className="h5 mb-3">Payment send</h2>
        <Form
          onSubmit={sendForm}
          validate={validateForm}
          initialValues={{ fee: 0.001, amount: 0.001 }}
          render={({ handleSubmit, submitting, pristine, form, values, errors }) => {
            return (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="recipient-address">Recipient address</label>
                    <Field
                      name="recipientAddress"
                      render={({ input, meta }) => (
                        <>
                          <input
                            id="recipient-address"
                            className={cn('form-control', {
                              'is-invalid': meta.touched && meta.error,
                            })}
                            type="text"
                            placeholder="Enter recipient address"
                            {...input}
                          />
                          <div className="invalid-feedback">{meta.error}</div>
                        </>
                      )}
                    />
                  </div>
                  <div className="mb-3 amount-container">
                    <label htmlFor="amount">Amount</label>
                    <Field
                      name="amount"
                      className={cn('form-control')}
                      render={({ input, meta }) => (
                        <>
                          <input
                            id="amount"
                            className={cn('form-control', {
                              'is-invalid': meta.touched && meta.error,
                            })}
                            type="number"
                            placeholder="0,000"
                            {...input}
                          />
                          {currentBalance !== 0 && (
                            <button
                              className="btn btn-link btn-sm btn-add-all"
                              type="button"
                              onClick={() => {
                                values.amount = Math.abs(
                                  (currentBalance - values.fee * constants.nanoErgInErg) /
                                    constants.nanoErgInErg,
                                );
                                form.blur('amount');
                              }}
                            >
                              Maximum
                            </button>
                          )}
                          <div className="invalid-feedback">{meta.error}</div>
                        </>
                      )}
                    />
                  </div>

                  {Object.keys(walletBalanceData?.assets || {}).length > 0 && (
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={assetCheckbox}
                        onChange={(e) => {
                          setAssetCheckbox(e.target.checked);
                        }}
                        id="assetCheckbox"
                      />
                      <label className="form-check-label" htmlFor="assetCheckbox">
                        Add asset
                      </label>
                    </div>
                  )}

                  {assetCheckbox && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="asset">Asset</label>
                        <Field name="asset" component="select" className={cn('form-control')}>
                          <option value="none">Choose asset</option>
                          {Object.keys(walletBalanceData?.assets || {}).map((tokenId) => (
                            <option key={tokenId} value={tokenId}>
                              {tokenId}
                            </option>
                          ))}
                        </Field>
                      </div>
                      {values.asset && values.asset !== 'none' && (
                        <div className="mb-3">
                          <label htmlFor="assetAmount">Asset amount</label>
                          <Field
                            name="assetAmount"
                            className={cn('form-control')}
                            render={({ input, meta }) => (
                              <>
                                <input
                                  id="assetAmount"
                                  className={cn('form-control', {
                                    'is-invalid': meta.touched && meta.error,
                                  })}
                                  type="number"
                                  placeholder="0,000"
                                  {...input}
                                />
                                <div className="invalid-feedback">{meta.error}</div>
                              </>
                            )}
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="mb-3">
                    <label htmlFor="fee">Fee (in ERG)</label>
                    <Field
                      name="fee"
                      value="0.001"
                      render={({ input, meta }) => (
                        <>
                          <input
                            id="fee"
                            className={cn('form-control', {
                              'is-invalid': meta.touched && meta.error,
                            })}
                            type="number"
                            placeholder="Minimum 0.001 ERG"
                            {...input}
                          />
                          <div className="invalid-feedback">{meta.error}</div>
                        </>
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      submitting ||
                      Object.keys(errors).length > 0 ||
                      pristine ||
                      values.asset === 'none'
                    }
                  >
                    Send
                  </button>
                </form>

                <InfoModal
                  open={isSentModalOpen}
                  onClose={() => {
                    setIsSentModalOpen(false);
                  }}
                  title="Payment sent"
                  description={
                    <>
                      <p>
                        Your payment has been sent successfully. The transaction ID is -{' '}
                        <CopyToClipboard>{transactionId}</CopyToClipboard>
                      </p>
                      <p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://explorer.ergoplatform.com/en/transactions/${transactionId}`}
                        >
                          Click Here To Go To The Explorer
                        </a>
                      </p>
                    </>
                  }
                  primaryButtonContent={<span className="pl-3 pr-3">OK</span>}
                  secondaryButtonContent="Send again"
                  onPrimaryHandler={() => resetForm(form)}
                />
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PaymentSendForm;

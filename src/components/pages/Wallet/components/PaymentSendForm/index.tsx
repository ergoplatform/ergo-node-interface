import React, { useState, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import InfoModal from 'components/common/InfoModal/InfoModal';
import cn from 'classnames';
import nodeApi from '../../../../../api/api';
import customToast from '../../../../../utils/toast';
import CopyToClipboard from '../../../../common/CopyToClipboard';
import constants from '../../../../../utils/constants';
import { CloseIcon } from '../../../../common/icons/CloseIcon';

type FormattedAsset = {
  tokenId: string;
  amount: number;
};

const ASSET_PREFIX = 'asset_';
const ASSET_AMOUNT_POSTFIX = '_amount';

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

  const generateRandomId = () => {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  };

  const [transactionId, setTransactionId] = useState(null);
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [assetCheckbox, setAssetCheckbox] = useState(false);
  const [assetsFormControlFields, setAssetsFromControlFields] = useState([generateRandomId()]);

  const getFormattedAssets = (values: any) => {
    return Object.keys(values)
      .filter((key) => key.includes(ASSET_PREFIX) && !key.includes(ASSET_AMOUNT_POSTFIX))
      .reduce((acc: any, key) => {
        const tokenId = values[key];
        const amount = Number(values[`${key}${ASSET_AMOUNT_POSTFIX}`]) * constants.nanoErgInErg;

        if (!tokenId || !amount) {
          return acc;
        }

        const assetData = {
          tokenId,
          amount,
        };

        return [...acc, assetData];
      }, []);
  };

  const addAssetsField = () => {
    if (assetsFormControlFields.length < Object.keys(walletBalanceData?.assets).length) {
      setAssetsFromControlFields([...assetsFormControlFields, generateRandomId()]);
    }
  };

  const removeAssetsField = (assetFieldId: string) => {
    // TODO: need to add form value clearance

    const index = assetsFormControlFields.indexOf(assetFieldId);

    setAssetsFromControlFields([
      ...assetsFormControlFields.slice(0, index),
      ...assetsFormControlFields.slice(index + 1, assetsFormControlFields.length),
    ]);
  };

  const paymentSend = useCallback(
    (values: any) => {
      const assets: Array<FormattedAsset> = getFormattedAssets(values);

      const request = {
        address: values.recipientAddress,
        value: Number((parseFloat(values.amount) * constants.nanoErgInErg).toFixed(1)),
        assets: assetCheckbox ? assets : [],
      };
      return nodeApi.post(
        '/wallet/transaction/send',
        {
          requests: [request],
          fee: Number((parseFloat(values.fee) * constants.nanoErgInErg).toFixed(1)),
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
      const errors: any = {};

      const totalFeeAndAmount =
        (Number(values.amount) + Number(values.fee)) * constants.nanoErgInErg;

      if (!values.recipientAddress) {
        errors.recipientAddress = 'The field cannot be empty';
      }

      if (!values.fee || values.fee < 0.001) {
        errors.fee = 'Minimum 0.001 ERG';
      }

      if (assetCheckbox) {
        for (let i = 0; i < assetsFormControlFields.length; i += 1) {
          const assetId = i;
          const assetKey = `${ASSET_PREFIX}${assetId}`;
          const assetAmountKey = `${ASSET_PREFIX}${assetId}${ASSET_AMOUNT_POSTFIX}`;

          const currentAsset = values[assetKey];
          const currentAssetAmount = values[assetAmountKey];

          if (currentAsset === 'none') {
            errors[assetKey] = 'You need to choose asset';
          }

          if (
            walletBalanceData &&
            currentAssetAmount &&
            currentAsset !== 'none' &&
            currentAssetAmount > walletBalanceData.assets[values[`asset${i}`]]
          ) {
            errors[assetAmountKey] = `Maximum ${walletBalanceData.assets[values.asset]}`;
          }

          if (!currentAssetAmount) {
            errors[assetAmountKey] = "The field can't be empty";
          }

          if (currentAsset && currentAsset !== 'none' && !currentAssetAmount) {
            errors[assetAmountKey] = 'Enter Asset amount';
          }
        }
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
    [assetCheckbox, walletBalanceData, currentBalance, assetsFormControlFields],
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
                        Add assets
                      </label>
                    </div>
                  )}

                  {console.log('values', values)}
                  {console.log('>> assetsFormControlFields', assetsFormControlFields)}

                  {assetCheckbox && (
                    <>
                      {assetsFormControlFields.map((assetFieldsId) => {
                        const assetKey = `${ASSET_PREFIX}${assetFieldsId}`;
                        const assetAmountKey = `${ASSET_PREFIX}${assetFieldsId}${ASSET_AMOUNT_POSTFIX}`;

                        return (
                          <div className="asset-field">
                            <button
                              type="button"
                              className="asset-field__btn-close"
                              onClick={() => {
                                removeAssetsField(assetFieldsId);
                                /*
                                  How to reset special form field ??
                                */
                              }}
                            >
                              <CloseIcon className="asset-field__btn-close-icon" />
                            </button>
                            <div className="mb-3">
                              <label htmlFor={assetKey}>Asset ID</label>
                              <Field
                                name={assetKey}
                                component="select"
                                className={cn('form-control')}
                              >
                                <option value="none">Choose asset</option>
                                {Object.keys(walletBalanceData?.assets || {}).map((tokenId) => (
                                  <option key={tokenId} value={tokenId}>
                                    {tokenId}
                                  </option>
                                ))}
                              </Field>
                            </div>
                            {values[assetKey] && values[assetKey] !== 'none' && (
                              <div className="mb-3">
                                <label htmlFor={assetAmountKey}>Asset amount</label>
                                <Field
                                  name={assetAmountKey}
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
                          </div>
                        );
                      })}
                      <button
                        className="btn btn-link btn-add-asset"
                        type="button"
                        onClick={addAssetsField}
                      >
                        + asset
                      </button>
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
                    disabled={submitting || Object.keys(errors).length > 0 || pristine}
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

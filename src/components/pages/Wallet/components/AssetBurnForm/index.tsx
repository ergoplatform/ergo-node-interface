import React, { useState, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import InfoModal from 'components/common/InfoModal/InfoModal';
import cn from 'classnames';
import nodeApi from '../../../../../api/api';
import customToast from '../../../../../utils/toast';
import CopyToClipboard from '../../../../common/CopyToClipboard';
import constants from '../../../../../utils/constants';

type Errors = {
  fee?: string;
  asset?: string;
  assetAmount?: string;
  decimals?: string;
};

const AssetBurnForm = ({
  apiKey,
  walletBalanceData,
  getWalletBalance,
  explorerSubdomain,
}: {
  apiKey: string;
  walletBalanceData: any;
  getWalletBalance: any;
  explorerSubdomain: string;
}) => {
  const currentBalance = walletBalanceData?.balance;

  const [transactionId, setTransactionId] = useState(null);
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);

  const paymentBurn = useCallback(
    ({ fee, asset, decimals, assetAmount }) => {
      const request = {
        assetsToBurn:
          asset !== 'none' && assetAmount > 0
            ? [{ tokenId: asset, amount: Number(assetAmount), decimals }]
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
    [apiKey],
  );

  const resetForm = (form: any) => {
    form.restart();
    setIsBurnModalOpen(false);
  };

  const sendForm = useCallback(
    (values) => {
      paymentBurn(values)
        .then(({ data }) => {
          setTransactionId(data);
          setIsBurnModalOpen(true);
          getWalletBalance();
        })
        .catch((err) => {
          const errMessage = err.data ? err.data.detail : err.message;
          customToast('error', errMessage);
        });
    },
    [paymentBurn, getWalletBalance],
  );

  const validateForm = useCallback(
    (values) => {
      const errors: Errors = {};

      if (values.asset === 'none') {
        errors.asset = 'You need to choose asset';
      }

      if (!values.assetAmount) {
        errors.assetAmount = "The field can't be empty";
      }

      if (values.assetAmount < 0) {
        errors.assetAmount = "Asset amount can't be negative";
      }

      if (!Number.isInteger(Number(values.assetAmount))) {
        errors.assetAmount = 'Should be an integer';
      }

      if (!values.fee || values.fee < 0.001) {
        errors.fee = 'Minimum 0.001 ERG';
      }

      if (!values.decimals) {
        errors.decimals = 'The field cannot be empty';
      }

      if (!Number.isInteger(Number(values.decimals)) && values.decimals) {
        errors.decimals = 'Should be an integer';
      }

      if (
        walletBalanceData &&
        values.assetAmount &&
        values.asset !== 'none' &&
        Number(values.assetAmount) / 10 ** values.decimals > walletBalanceData?.assets[values.asset]
      ) {
        errors.assetAmount = `Maximum ${walletBalanceData?.assets[values.asset]}`;
      }

      if (currentBalance < values.fee) {
        errors.fee = `Maximum ${Math.abs(
          currentBalance / constants.nanoErgInErg - Number(values.fee),
        )} ERG`;
      }

      return errors;
    },
    [walletBalanceData, currentBalance],
  );

  return (
    <div className="card bg-white p-4">
      <h2 className="h5 mb-3">Burn Tokens</h2>
      <Form
        onSubmit={sendForm}
        validate={validateForm}
        initialValues={{ fee: 0.001 }}
        render={({ handleSubmit, submitting, pristine, form, values, errors }) => {
          return (
            <>
              <form onSubmit={handleSubmit}>
                <Field
                  name="assetAmount"
                  className={cn('form-control')}
                  render={({ input, meta }) => (
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
                      <div className="mb-3">
                        <label htmlFor="assetAmount">Asset amount</label>
                        <input
                          id="assetAmount"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          type="float"
                          placeholder="0,000"
                          {...input}
                        />
                        <div className="invalid-feedback">{meta.error}</div>
                      </div>
                    </>
                  )}
                />
                <div className="mb-3">
                  <label htmlFor="decimals">Decimal places</label>
                  <Field
                    name="decimals"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="decimals"
                          type="text"
                          placeholder="Enter decimals as integer"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          {...input}
                        />
                        <div className="invalid-feedback">{meta.error}</div>
                      </>
                    )}
                  />
                </div>
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
                          type="float"
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
                  Burn
                </button>
              </form>

              <InfoModal
                open={isBurnModalOpen}
                onClose={() => {
                  setIsBurnModalOpen(false);
                }}
                title="Burn complete"
                description={
                  <>
                    <p>
                      Your burn request has been processed successfully. The transaction ID is -{' '}
                      <CopyToClipboard>{transactionId}</CopyToClipboard>
                    </p>
                    <p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://${explorerSubdomain}.ergoplatform.com/en/transactions/${transactionId}`}
                      >
                        Click Here To Go To The Explorer
                      </a>
                    </p>
                  </>
                }
                primaryButtonContent={<span className="pl-3 pr-3">OK</span>}
                secondaryButtonContent="Burn again"
                onPrimaryHandler={() => resetForm(form)}
              />
            </>
          );
        }}
      />
    </div>
  );
};

export default AssetBurnForm;

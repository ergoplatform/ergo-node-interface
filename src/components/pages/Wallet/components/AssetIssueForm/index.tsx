import React, { useCallback, useState } from 'react';
import { Field, Form } from 'react-final-form';

import cn from 'classnames';
import InfoModal from 'components/common/InfoModal/InfoModal';
import CopyToClipboard from 'components/common/CopyToClipboard';
import customToast from 'utils/toast';
import nodeApi from 'api/api';
import constants from '../../../../../utils/constants';

type AssetIssueFormData = {
  name?: string;
  amount?: string;
  decimals?: string;
  description?: string;
  fee?: string;
};

const AssetIssueForm = ({
  apiKey,
  getWalletBalance,
  explorerSubdomain,
}: {
  apiKey: string;
  getWalletBalance: any;
  explorerSubdomain: string;
}) => {
  const [transactionId, setTransactionId] = useState(null);
  const [isSentModalOpen, setIsSentModalOpen] = useState(false);
  const [assetAmount, setAssetAmount] = useState(null);
  const [assetName, setAssetName] = useState(null);

  const issueAsset = useCallback(
    ({ name, amount, decimals, description, fee }) => {
      setAssetAmount(amount);
      setAssetName(name);
      const request = {
        name,
        amount,
        decimals,
        description,
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
    [apiKey, setAssetAmount, setAssetName],
  );

  const submitForm = useCallback(
    (formData) => {
      return issueAsset(formData)
        .then(({ data }) => {
          const generatedTransactionId = data;
          setTransactionId(generatedTransactionId);
          setIsSentModalOpen(true);
          getWalletBalance();
        })
        .catch((err) => {
          const errMessage = err.data ? err.data.detail : err.message;
          customToast('error', errMessage);
        });
    },
    [issueAsset, getWalletBalance],
  );

  const resetForm = (form: any) => {
    form.restart();
    setIsSentModalOpen(false);
  };

  const validateForm = (values: AssetIssueFormData) => {
    const errors: AssetIssueFormData = {};

    if (!values.name) {
      errors.name = 'The field cannot be empty';
    }

    if (!values.amount) {
      errors.amount = 'The field cannot be empty';
    }

    if (!values.decimals) {
      errors.decimals = 'The field cannot be empty';
    }

    if (!values.description) {
      errors.description = 'The field cannot be empty';
    }

    if (!values.fee || Number(values.fee) < 0.001) {
      errors.fee = 'Minimum 0.001 ERG';
    }

    if (!Number.isInteger(Number(values.amount)) && values.amount) {
      errors.amount = 'Should be an integer';
    }

    if (!Number.isInteger(Number(values.decimals)) && values.decimals) {
      errors.decimals = 'Should be an integer';
    }

    if (Number(values.fee) < 0) {
      errors.fee = "Fee can't be negative";
    }

    return errors;
  };

  return (
    <div className="card bg-white p-4">
      <h2 className="h5 mb-3">Issue Tokens</h2>
      <Form
        onSubmit={submitForm}
        validate={validateForm}
        initialValues={{ fee: 0.001 }}
        render={({ handleSubmit, submitting, pristine, form, errors }) => {
          return (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name">Asset name</label>
                  <Field
                    name="name"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter asset name"
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
                  <label htmlFor="amount">Net amount</label>
                  <Field
                    name="amount"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="amount"
                          type="text"
                          placeholder="Enter net amount"
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
                  <label htmlFor="description">Brief description</label>
                  <Field
                    name="description"
                    render={({ input, meta }) => (
                      <>
                        <textarea
                          id="description"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          placeholder="Add asset description"
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
                  Issue
                </button>
              </form>

              <InfoModal
                open={isSentModalOpen}
                onClose={() => {
                  setIsSentModalOpen(false);
                }}
                title="Congratulations!"
                description={
                  <>
                    <p>
                      {`You have successfully issued ${assetAmount} ${assetName} tokens! The transaction ID is\n`}
                      <CopyToClipboard>{transactionId}</CopyToClipboard>
                    </p>
                    <p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://${explorerSubdomain}.ergoplatform.com/en/transactions/${transactionId}`}
                      >
                        Click Here To View Transaction
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
  );
};

export default AssetIssueForm;

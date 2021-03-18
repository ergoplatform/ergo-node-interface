import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { apiKeySelector } from '../../../store/selectors/app';
import appActions from '../../../store/actions/appActions';
import nodeApi from '../../../api/api';
import customToast from '../../../utils/toast';
import ApiKeyModalView from './ApiKeyModalView';

const mapStateToProps = (state) => ({
  apiKey: apiKeySelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetApiKey: (apiKey) => dispatch(appActions.setApiKey(apiKey)),
});

const ApiKeyModalContainer = (props) => {
  const { dispatchSetApiKey, apiKey } = props;

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShowModal(true);
  };

  const handleHide = () => {
    setShowModal(false);
  };

  const submitForm = (values, uuid) => {
    // Check API key for random get method
    nodeApi
      .get('/wallet/status', {
        headers: {
          api_key: values[`apiKey${uuid}`],
        },
      })
      .then(() => {
        dispatchSetApiKey(values[`apiKey${uuid}`].trim());
        customToast('success', 'API key is set successfully');
        handleHide();
      })
      .catch(() => {
        customToast('error', 'Bad API key');
      });
  };

  return (
    <ApiKeyModalView
      showModal={showModal}
      apiKey={apiKey}
      handleHide={handleHide}
      submitForm={submitForm}
      handleShow={handleShow}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ApiKeyModalContainer));

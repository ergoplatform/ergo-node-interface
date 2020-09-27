import React from 'react';
import { Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

const renderButton = (apiKey, handleShow) => {
  if (apiKey === '') {
    return (
      <button type="button" onClick={handleShow} className="btn btn-primary">
        Set API key
      </button>
    );
  }

  return (
    <button type="button" onClick={handleShow} className="btn btn-outline-primary">
      Update API key
    </button>
  );
};

const ApiKeyModalView = ({ showModal, handleHide, submitForm, apiKey, handleShow }) => {
  return (
    <div>
      {renderButton(apiKey, handleShow)}
      <Modal show={showModal} onHide={() => handleHide()} centered>
        <Formik initialValues={{ apiKey }} onSubmit={submitForm}>
          {() => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Authorization</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="text">Set API key to access Node requests</p>
                <div className="input-group">
                  <Field
                    type="text"
                    name="apiKey"
                    className="form-control"
                    placeholder="Enter API key"
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <button type="button" className="btn btn-outline-secondary" onClick={handleHide}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default ApiKeyModalView;

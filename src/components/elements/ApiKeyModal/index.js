import React, { Component, memo } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Formik, Field, Form } from 'formik'
import { connect } from 'react-redux'
import { apiKeySelector } from '../../../store/selectors/app'
import appActions from '../../../store/actions/appActions'
import nodeApi from '../../../api/api'
import customToast from '../../../utils/toast'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
})

const mapDispatchToProps = dispatch => ({
  dispatchSetApiKey: apiKey => dispatch(appActions.setApiKey(apiKey)),
})
class ApiKeyForm extends Component {
  state = {
    showModal: false,
  }

  handleShow = () => {
    this.setState({ showModal: true })
  }

  handleHide = () => {
    this.setState({ showModal: false })
  }

  submitForm = ({ apiKey }) => {
    // Check API key for random get method
    nodeApi
      .get('/wallet/status', {
        headers: {
          api_key: apiKey,
        },
      })
      .then(() => {
        this.props.dispatchSetApiKey(apiKey)
        customToast('success', 'API key is set successfully')
        this.handleHide()
      })
      .catch(() => {
        customToast('error', 'Bad API key')
      })
  }

  renderButton = () => {
    if (this.props.apiKey === '') {
      return (
        <button onClick={this.handleShow} className="btn btn-success">
          Set API key
        </button>
      )
    }

    return (
      <button onClick={this.handleShow} className="btn btn-primary">
        Update API key
      </button>
    )
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        <Modal
          show={this.state.showModal}
          onHide={() => this.handleHide()}
          centered
        >
          <Formik
            initialValues={{ apiKey: this.props.apiKey }}
            onSubmit={this.submitForm}
          >
            {() => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title>Authorization</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className="text-">Set API key to access Node requests</p>
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
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={this.handleHide}
                  >
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
    )
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(ApiKeyForm))

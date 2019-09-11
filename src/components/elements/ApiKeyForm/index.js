import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Formik, Field, Form } from 'formik'
import { ApiKeyContext } from '../../../context/context'

export default class ApiKeyForm extends Component {
  static contextType = ApiKeyContext

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      inputApiKey: '',
    }
  }

  handleShow = () => {
    this.setState({ showModal: true })
  }

  handleHide = () => {
    this.setState({ showModal: false })
  }

  submitForm = ({ apiKey }) => {
    this.context.setApiKey(apiKey)
    this.handleHide()
  }

  renderButton = () => {
    if (this.context.value === '') {
      return (
        <button onClick={this.handleShow} className="btn btn-warning">
          Set API key
        </button>
      )
    }

    return (
      <button onClick={this.handleShow} className="btn btn-outline-light">
        Update API key
      </button>
    )
  }

  renderLink = () => (
    <a href="#modal-root" onClick={this.handleShow}>
      Set API key
    </a>
  )

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
            initialValues={{ apiKey: this.context.value }}
            onSubmit={this.submitForm}
          >
            {() => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title id="example-custom-modal-styling-title">
                    Authorization
                  </Modal.Title>
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

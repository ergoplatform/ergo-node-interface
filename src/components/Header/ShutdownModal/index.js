import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { apiKeySelector } from 'store/selectors/app';
import nodeApi from '../../../api/api';

const mapStateToProps = (state) => ({
  apiKey: apiKeySelector(state),
});

class ShutdownModal extends Component {
  handleSubmit = (pass) => {
    nodeApi.post(
      '/node/shutdown',
      { pass },
      {
        headers: {
          api_key: this.props.apiKey,
        },
      },
    );
  };

  render() {
    return (
      <div>
        <button type="button" className="btn btn-outline-danger ml-4" onClick={this.handleSubmit}>
          Shutdown Node
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(memo(ShutdownModal));

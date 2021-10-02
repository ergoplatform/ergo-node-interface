import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { faWpexplorer } from '@fortawesome/free-brands-svg-icons';
import nodeActions from 'store/actions/nodeActions';
import { explorerSelector } from 'store/selectors/node';

const mapStateToProps = (state) => ({ explorer: explorerSelector(state) });

const mapDispatchToProps = (dispatch) => ({
  dispatchGetNetwork: () => dispatch(nodeActions.getNetwork()),
});

const icon = <FontAwesomeIcon icon={faWpexplorer} />;
const title = 'Explorer';

class Explorer extends Component {
  render() {
    const { explorer, dispatchGetNetwork } = this.props;
    dispatchGetNetwork();

    return (
      <a
        ref={this.exporerRef}
        key="Explorer"
        className={clsx('list-group-item list-group-item-action')}
        href={`https://${explorer}.ergoplatform.com`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {icon} {title}
      </a>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);

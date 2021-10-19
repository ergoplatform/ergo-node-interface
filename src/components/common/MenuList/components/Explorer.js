import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { faWpexplorer } from '@fortawesome/free-brands-svg-icons';
import { explorerSelector } from 'store/selectors/node';

const mapStateToProps = (state) => ({ explorerSubdomain: explorerSelector(state) });

const icon = <FontAwesomeIcon icon={faWpexplorer} />;
const title = 'Explorer';

class Explorer extends Component {
  render() {
    const { explorerSubdomain } = this.props;

    return (
      <a
        ref={this.exporerRef}
        key="Explorer"
        className={clsx('list-group-item list-group-item-action')}
        href={`https://${explorerSubdomain}.ergoplatform.com`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {icon} {title}
      </a>
    );
  }
}

export default connect(mapStateToProps, null)(Explorer);

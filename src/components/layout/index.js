import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MenuList from '../common/MenuList';
import './index.scss';
import Header from '../Header';

class Layout extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="sidebar">
          <MenuList />
        </div>
        <main className="main-container">
          <div className="content">{this.props.children}</div>
        </main>
      </div>
    );
  }
}

export default withRouter(Layout);

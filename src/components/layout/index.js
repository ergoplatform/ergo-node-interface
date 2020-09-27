import React from 'react';
import { withRouter } from 'react-router-dom';
import MenuList from '../common/MenuList';
import './index.scss';
import Header from '../Header';

export const Layout = withRouter((props) => {
  return (
    <div>
      <Header />
      <div className="sidebar">
        <MenuList />
      </div>
      <main className="main-container">
        <div className="content">{props.children}</div>
      </main>
    </div>
  );
});

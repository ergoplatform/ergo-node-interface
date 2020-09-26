import React, { memo } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApiKeyModal from './ApiKeyModal';
import WalletStatusModal from './WalletStatusModal';
import WalletInitModal from './WalletInitModal';
import logo from '../../assets/images/logotype_white.svg';

const renderWalletForms = (isWalletInitialized) => {
  if (isWalletInitialized === null) {
    return <></>;
  }

  if (isWalletInitialized) {
    return (
      <div className="ml-4">
        <WalletStatusModal />
      </div>
    );
  }

  return (
    <div className="ml-4">
      <WalletInitModal />
    </div>
  );
};

const HeaderView = ({ isApiKeySetted, isWalletInitialized }) => {
  return (
    <Navbar className="navbar-background" expand="lg">
      <Navbar.Brand className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="logotype" className="logotype" />
        </Link>
      </Navbar.Brand>
      <div className="ml-4">
        <ApiKeyModal />
      </div>
      {isApiKeySetted && renderWalletForms(isWalletInitialized)}
    </Navbar>
  );
};

export default memo(HeaderView);

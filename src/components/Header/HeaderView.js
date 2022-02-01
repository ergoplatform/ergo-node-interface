import React, { memo, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ApiKeyModal from './ApiKeyModal';
import ShutdownModal from './ShutdownModal';
import WalletStatusModal from './WalletStatusModal';
import WalletInitModal from './WalletInitModal';
import logo from '../../assets/images/logotype_white.svg';
import { MODAL_STATES } from './utils';

const renderWalletForms = (isWalletInitialized, openedModal, setOpenedModal) => {
  if (isWalletInitialized === null) {
    return <></>;
  }

  if (isWalletInitialized && openedModal !== MODAL_STATES.INIT) {
    return (
      <div className="ml-4">
        <WalletStatusModal onOpen={setOpenedModal} />
      </div>
    );
  }

  return (
    <div className="ml-4">
      <WalletInitModal onOpen={setOpenedModal} />
    </div>
  );
};

const HeaderView = ({ isApiKeySetted, isWalletInitialized }) => {
  const [openedModal, setOpenedModal] = useState(null);

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
      {isApiKeySetted && renderWalletForms(isWalletInitialized, openedModal, setOpenedModal)}
      <ShutdownModal />
    </Navbar>
  );
};

export default memo(HeaderView);

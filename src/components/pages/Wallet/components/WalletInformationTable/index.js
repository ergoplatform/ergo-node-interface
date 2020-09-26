import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import './index.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { CopyIcon, RemoveIcon } from '../../../../common/icons/icons';
import {
  walletBalanceDataSelector,
  ergPriceSelector,
} from '../../../../../store/selectors/wallet';
import walletActions from '../../../../../store/actions/walletActions';

const WalletInformationTableItem = ({ name, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  let resultTitle;
  let resultContent;

  if (Array.isArray(value)) {
    resultTitle = value.length;

    resultContent = (
      <div>
        {value.map((item) => (
          <>
            <div>
              {item.name || ''} {item.value || ''}
            </div>
            <br />
          </>
        ))}
      </div>
    );
  } else {
    resultTitle = value;
    resultContent = value;
  }

  return (
    <div className="wallet-table__item">
      <div
        className={cn('wallet-table-item-header', {
          'wallet-table-item-header--opened': isOpen,
        })}
      >
        <div className="wallet-table-item-header__title">{name}</div>
        <div className="wallet-table-item-header__right-side">
          <CopyToClipboard text={value}>
            <button
              className="wallet-table-item-header__copy"
              onClick={() => {
                alert.show(
                  <span style={{ textTransform: 'initial' }}>Copied</span>
                );
              }}
            >
              <CopyIcon />
            </button>
          </CopyToClipboard>

          {!isOpen && (
            <div className="wallet-table-item-header__opacity-paragraph">
              {resultTitle}
            </div>
          )}

          <a
            className="wallet-table-item-header__link"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {!isOpen && 'More'}
            {isOpen && <RemoveIcon />}
          </a>
        </div>
      </div>
      {isOpen && <div className="wallet-table-item-body">{resultContent}</div>}
    </div>
  );
};

const WalletInformationTable = (props) => {
  const {
    walletBalance,
    ergPrice,
    dispatchGetWalletBalance,
    dispatchGetErgPrice,
  } = props;

  useEffect(() => {
    dispatchGetWalletBalance();
    dispatchGetErgPrice();
  }, [dispatchGetErgPrice, dispatchGetWalletBalance]);

  const data = [
    {
      name: 'Balance',
      value: walletBalance ? `${walletBalance.balance} ERG` : 'loading...',
    },
    {
      name: 'Balance in USD',
      value: walletBalance
        ? `$ ${walletBalance.balance * ergPrice}`
        : 'Loading...',
    },
    {
      name: 'Assets',
      value: [
        {
          name: '123',
          value: 121423,
        },
        {
          name: '123',
          value: 121423,
        },
        {
          name: '123',
          value: 121423,
        },
        {
          name: '123',
          value: 121423,
        },
      ],
    },
    {
      name: 'Addresses',
      value: [
        {
          value: 121423,
        },
        {
          value: 121423,
        },
        {
          value: 121423,
        },
        {
          value: 121423,
        },
      ],
    },
  ];

  return (
    <div className="wallet-table">
      <div className="wallet-table__header">
        <h2 className="wallet-table__title">Wallet Information</h2>
      </div>
      <div className="wallet-table__body">
        {data.map(({ value, name }) => (
          <WalletInformationTableItem key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  walletBalance: walletBalanceDataSelector(state),
  ergPrice: ergPriceSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  dispatchGetWalletBalance: () => dispatch(walletActions.getWalletBalance()),
  dispatchGetErgPrice: () => dispatch(walletActions.getErgPrice()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletInformationTable);

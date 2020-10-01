import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cn from 'classnames';
import './index.scss';
import { connect } from 'react-redux';
import { RedoIcon } from 'components/common/icons/RedoIcon';
import constants from 'utils/constants';
import { RemoveIcon } from '../../../../common/icons/icons';
import {
  walletBalanceDataSelector,
  ergPriceSelector,
  walletAddressesSelector,
} from '../../../../../store/selectors/wallet';
import walletActions from '../../../../../store/actions/walletActions';

const WalletInformationTableItem = ({ name, value }: any) => {
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
              {item.value || ''} {item.name || ''}
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
          {!isOpen && (
            <div className="wallet-table-item-header__opacity-paragraph">{resultTitle}</div>
          )}

          <a className="wallet-table-item-header__link" onClick={() => setIsOpen((prev) => !prev)}>
            {!isOpen && 'More'}
            {isOpen && <RemoveIcon />}
          </a>
        </div>
      </div>
      {isOpen && <div className="wallet-table-item-body">{resultContent}</div>}
    </div>
  );
};

const WalletInformationTable = (props: any) => {
  const {
    walletBalance,
    ergPrice,
    dispatchGetWalletBalance,
    dispatchGetErgPrice,
    dispatchGetWalletAddresses,
    walletAddresses,
  } = props;

  const getValues = useCallback(() => {
    dispatchGetWalletBalance();
    dispatchGetErgPrice();
    dispatchGetWalletAddresses();
  }, [dispatchGetWalletBalance, dispatchGetErgPrice, dispatchGetWalletAddresses]);

  const getAddreses = useCallback((addresses: String[]) => {
    if (addresses.length === 0) {
      return 0;
    }

    return addresses.map((item) => ({
      value: (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`https://explorer.ergoplatform.com/en/addresses/${item}`}
        >
          {item}
        </a>
      ),
    }));
  }, []);

  const getAssets = useCallback((assets) => {
    if (Object.values(assets).length === 0) {
      return 0;
    }

    return assets.map(({ tokenId, amount }: any) => ({
      name: <span className="text-muted">{tokenId}</span>,
      value: <span className="font-weight-bold">{amount}</span>,
    }));
  }, []);

  useEffect(() => {
    getValues();
  }, [getValues]);

  const data = useMemo(
    () => [
      {
        name: 'Balance',
        value: walletBalance
          ? `${walletBalance.balance / constants.nanoErgInErg} ERG`
          : 'loading...',
      },
      // {
      //   name: 'Balance in USD',
      //   value: walletBalance
      //     ? `$ ${(walletBalance.balance / constants.nanoErgInErg) * ergPrice}`
      //     : 'Loading...',
      // },
      {
        name: 'Assets',
        value: walletBalance ? getAssets(walletBalance.assets) : `Loading...`,
      },
      {
        name: 'Addresses',
        value: walletAddresses ? getAddreses(walletAddresses) : `Loading...`,
      },
    ],
    [walletBalance, ergPrice, getAssets, walletAddresses, getAddreses],
  );

  const updateValues = useCallback(() => {
    getValues();
  }, [getValues]);

  return (
    <div className="wallet-table">
      <div className="wallet-table__header">
        <h2 className="wallet-table__title">
          Wallet Information{' '}
          <button type="button" className="wallet-table__icon-redo" onClick={updateValues}>
            <RedoIcon />
          </button>
        </h2>
      </div>
      <div className="wallet-table__body">
        {data.map(({ value, name }) => (
          <WalletInformationTableItem key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  walletBalance: walletBalanceDataSelector(state),
  ergPrice: ergPriceSelector(state),
  walletAddresses: walletAddressesSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchGetWalletBalance: () => dispatch(walletActions.getWalletBalance()),
  dispatchGetErgPrice: () => dispatch(walletActions.getErgPrice()),
  dispatchGetWalletAddresses: () => dispatch(walletActions.getWalletAddresses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletInformationTable);

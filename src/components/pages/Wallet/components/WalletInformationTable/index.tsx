import React, { useState, useEffect, useCallback, useMemo } from 'react';
import cn from 'classnames';
import './index.scss';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import useAxios, { configure } from 'axios-hooks';
import { RedoIcon } from 'components/common/icons/RedoIcon';
import constants from 'utils/constants';
import nodeApi from '../../../../../api/api';
import { RemoveIcon } from '../../../../common/icons/icons';
import {
  walletBalanceDataSelector,
  ergPriceSelector,
  walletAddressesSelector,
} from '../../../../../store/selectors/wallet';
import { explorerSelector } from '../../../../../store/selectors/node';
import walletActions from '../../../../../store/actions/walletActions';

enum WalletInformationHeadings {
  Balance = 'Balance',
  Assets = 'Assets',
  Addresses = 'Addresses',
}

const RenderAssetDecimals = ({ name, apiKey }: any) => {
  configure({ axios: nodeApi });

  const [{ data, loading, error }] = useAxios({
    url: `/blockchain/token/byId/${name?.props?.children}`,
    headers: {
      api_key: apiKey,
    },
  });

  if (loading) return <td>...</td>;

  if (data) return <td>{data.decimals}</td>;

  if (error)
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip id="tooltip">
            <strong>Please ensure you have Extra Indexing enabled</strong>
          </Tooltip>
        }
      >
        <td>N/A ⓘ</td>
      </OverlayTrigger>
    );

  return <td>N/A</td>;
};

const WalletInformationTableItem = ({ name, value, apiKey }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  let resultTitle;
  let resultContent;

  if (Array.isArray(value)) {
    resultTitle = value.length;

    resultContent = (
      <div>
        {name === WalletInformationHeadings.Assets ? (
          <table>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Decimals</th>
            </tr>
            {value.map((item) => (
              <tr key={item.name}>
                <td>{item.name || ''}</td>
                <td>{item.value || ''}</td>
                <RenderAssetDecimals name={item.name} apiKey={apiKey} />
              </tr>
            ))}
          </table>
        ) : (
          <div>
            {value.map((item) => (
              <div key={item.name} className="mt-20">
                {item.value || ''} {item.name || ''}
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    resultTitle = value;
    resultContent = <div className="mt-20">{value}</div>;
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
    dispatchGetWalletBalance,
    dispatchGetErgPrice,
    dispatchGetWalletAddresses,
    walletAddresses,
    explorerSubdomain,
    apiKey,
  } = props;

  const getValues = useCallback(() => {
    dispatchGetWalletBalance();
    dispatchGetErgPrice();
    dispatchGetWalletAddresses();
  }, [dispatchGetWalletBalance, dispatchGetErgPrice, dispatchGetWalletAddresses]);

  const getAddreses = useCallback((addresses: String[], subdomain: String) => {
    if (addresses.length === 0) {
      return 0;
    }

    return addresses.map((item) => ({
      value: (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`https://${subdomain}.ergoplatform.com/en/addresses/${item}`}
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

    return Object.keys(assets).map((key) => ({
      name: <span className="text-muted">{key}</span>,
      value: <span className="font-weight-bold">{assets[key]}</span>,
    }));
  }, []);

  useEffect(() => {
    getValues();
  }, [getValues]);

  const data = useMemo(
    () => [
      {
        name: WalletInformationHeadings.Balance,
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
        name: WalletInformationHeadings.Assets,
        value: walletBalance ? getAssets(walletBalance.assets) : `Loading...`,
      },
      {
        name: WalletInformationHeadings.Addresses,
        value: walletAddresses ? getAddreses(walletAddresses, explorerSubdomain) : `Loading...`,
      },
    ],
    [walletBalance, getAssets, walletAddresses, getAddreses, explorerSubdomain],
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
          <WalletInformationTableItem key={name} name={name} value={value} apiKey={apiKey} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  walletBalance: walletBalanceDataSelector(state),
  ergPrice: ergPriceSelector(state),
  walletAddresses: walletAddressesSelector(state),
  explorerSubdomain: explorerSelector(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchGetWalletBalance: () => dispatch(walletActions.getWalletBalance()),
  dispatchGetErgPrice: () => dispatch(walletActions.getErgPrice()),
  dispatchGetWalletAddresses: () => dispatch(walletActions.getWalletAddresses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletInformationTable);

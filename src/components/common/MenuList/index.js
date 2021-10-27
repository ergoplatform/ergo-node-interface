import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faExchangeAlt, faGlobe, faBook } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { withRouter, Link } from 'react-router-dom';
import constants from '../../../utils/constants';
import Explorer from './components/Explorer';

const localRouteList = {
  dashboard: {
    href: '/',
    icon: <FontAwesomeIcon icon={faChartLine} />,
    title: 'Dashboard',
  },
  wallet: {
    href: '/wallet',
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
    title: 'Wallet',
  },
};

const externalRouteList = {
  swaggerInterface: {
    href: constants.swaggerInterface,
    icon: <FontAwesomeIcon icon={faBook} />,
    title: 'Swagger',
  },
  website: {
    href: constants.website,
    icon: <FontAwesomeIcon icon={faGlobe} />,
    title: 'Website',
  },
};

const MenuList = ({ location: { pathname } }) => {
  return (
    <div>
      <p className="h5 pl-3 pt-4">Menu</p>
      <hr className="mb-0" />
      <div className="list-group list-group-flush">
        {Object.values(localRouteList).map(({ href, icon, title }, index) => (
          <Link
            key={title}
            className={clsx('list-group-item list-group-item-action', {
              'list-group-item-dark': href === pathname,
              active: href === pathname,
              'border-top-0': index === 0,
            })}
            to={href}
          >
            {icon} {title}
          </Link>
        ))}
      </div>
      <p className="h5 pl-3 pt-4">External links</p>
      <hr className="mb-0" />
      <div className="list-group list-group-flush">
        {Object.values(externalRouteList).map(({ href, icon, title }, index) => (
          <a
            key={title}
            className={clsx('list-group-item list-group-item-action', {
              'border-top-0': index === 0,
            })}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {icon} {title}
          </a>
        ))}
        <Explorer />
      </div>
    </div>
  );
};

export default withRouter(MenuList);

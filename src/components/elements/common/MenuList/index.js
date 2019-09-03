import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartLine,
  faExchangeAlt,
  faGlobe,
  faBook,
} from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import { faWpexplorer } from '@fortawesome/free-brands-svg-icons'
import { withRouter, Link } from 'react-router-dom'
import constants from '../../../../constants'

const routerList = {
  dashboard: {
    href: '/',
    icon: <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon>,
    title: 'Dashboard',
  },
  wallet: {
    href: '/wallet',
    icon: <FontAwesomeIcon icon={faExchangeAlt}></FontAwesomeIcon>,
    title: 'Wallet',
  },
  swaggerInterface: {
    href: constants.swaggerInterface,
    icon: <FontAwesomeIcon icon={faBook}></FontAwesomeIcon>,
    title: 'Swagger',
    isOutsideLink: true,
  },
  explorer: {
    href: constants.explorer,
    icon: <FontAwesomeIcon icon={faWpexplorer}></FontAwesomeIcon>,
    title: 'Explorer',
    isOutsideLink: true,
  },
  website: {
    href: constants.website,
    icon: <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>,
    title: 'Website',
    isOutsideLink: true,
  },
}

const MenuList = ({ location: { pathname } }) => {
  return (
    <div className="pt-4">
      <p className="h5 pl-3">Menu</p>
      <hr className="mb-0" />
      <div className="list-group list-group-flush">
        {Object.values(routerList).map(
          ({ href, icon, title, isOutsideLink }, index) =>
            isOutsideLink ? (
              <a
                key={title}
                className="list-group-item list-group-item-action"
                href={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {icon} {title}
              </a>
            ) : (
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
            ),
        )}
      </div>
    </div>
  )
}

export default withRouter(MenuList)

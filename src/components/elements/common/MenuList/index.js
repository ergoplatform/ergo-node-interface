import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

const MenuList = () => (
  <div className="pt-4">
    <p className="h5 pl-3">Menu</p>
    <hr />
    <ul className="list-group list-group-flush">
      <li
        className="list-group-item list-group-item-action list-group-item-dark active"
        aria-disabled="true"
      >
        <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon> Dashboard
      </li>
      <li className="list-group-item list-group-item-action">
        <FontAwesomeIcon icon={faExchangeAlt}></FontAwesomeIcon> Wallet
      </li>
    </ul>
  </div>
)

export default MenuList

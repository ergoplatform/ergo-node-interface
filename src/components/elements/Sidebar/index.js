import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <ul>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <Link to="/wallet">Wallet</Link>
      </li>
    </ul>
  )
}

export default Sidebar

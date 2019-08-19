import React from 'react'
import Header from '../elements/Header'
import Sidebar from '../elements/Sidebar'
import './index.scss'

const Layout = props => (
  <div className="n-grid">
    <Header></Header>
    <Sidebar></Sidebar>
    <div className="content">{props.children}</div>
  </div>
)

export default Layout

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MenuList from '../elements/common/MenuList'
import { Navbar } from 'react-bootstrap'
import logo from '../../assets/images/logotype_white.svg'
import './index.scss'

class Layout extends Component {
  render() {
    return (
      <div>
        <Navbar className="navbar-background" expand="lg">
          <Navbar.Brand className="navbar-brand">
            <a href="/">
              <img src={logo} alt="logotype" className="logotype" />
            </a>
          </Navbar.Brand>
        </Navbar>
        <div className="sidebar">
          <MenuList></MenuList>
        </div>
        <main className="main-container">
          <div className="content">{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default withRouter(Layout)

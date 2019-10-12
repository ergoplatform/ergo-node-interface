import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import MenuList from '../common/MenuList'
import ApiKeyForm from '../elements/ApiKeyForm'
import logo from '../../assets/images/logotype_white.svg'
import './index.scss'

class Layout extends Component {
  render() {
    return (
      <div>
        <Navbar className="navbar-background" expand="lg">
          <Navbar.Brand className="navbar-brand">
            <Link to="/">
              <img src={logo} alt="logotype" className="logotype" />
            </Link>
          </Navbar.Brand>
          <div className="ml-4">
            <ApiKeyForm />
          </div>
        </Navbar>
        <div className="sidebar">
          <MenuList />
        </div>
        <main className="main-container">
          <div className="content h-100">{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default withRouter(Layout)

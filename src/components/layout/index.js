import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import MenuList from '../elements/common/MenuList'
import Sidebar from 'react-sidebar'
import { Navbar } from 'react-bootstrap'
import logo from '../../assets/images/logotype_white.svg'
import './index.scss'

class Layout extends Component {
  render() {
    return (
      <div>
        <Navbar className="navbar-background" expand="lg">
          <Navbar.Brand className="navbar-brand">
            <img src={logo} alt="logotype" className="logotype" />
          </Navbar.Brand>
        </Navbar>
        <div className="sidebar">
          <Sidebar
            sidebar={<MenuList></MenuList>}
            children={<MenuList></MenuList>}
            docked={true}
            shadow={false}
            styles={{
              sidebar: {
                background: '#fff',
                borderRight: '1px solid rgba(0,0,0,.1)',
                width: '256px',
                boxShadow: 'none !important'
              }
            }}
          ></Sidebar>
        </div>
        <main className="main-container">
          <div className="content mt-4">{this.props.children}</div>
        </main>
      </div>
    )
  }
}

export default withRouter(Layout)

import React, { Fragment } from 'react'
import Header from '../elements/Header'

const Layout = props => (
  <Fragment>
    <Header></Header>
    <div>{props.children}</div>
  </Fragment>
)

export default Layout

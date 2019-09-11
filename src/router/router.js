import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Layout from '../components/layout'
import Dashboard from '../components/pages/Dashboard'
import Wallet from '../components/pages/Wallet'

const Router = () => (
  <BrowserRouter>
    <Layout>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/wallet" component={Wallet} />
      </Switch>
    </Layout>
  </BrowserRouter>
)

export default Router

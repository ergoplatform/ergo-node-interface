import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Layout from './components/layout'
import Dashboard from './components/pages/Dashboard'

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </Layout>
    </Router>
  )
}

export default App

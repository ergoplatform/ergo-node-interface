import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Layout from './components/layout'
import Main from './components/pages/Main'

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Main} />
        </Switch>
      </Layout>
    </Router>
  )
}

export default App

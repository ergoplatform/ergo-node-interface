import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Layout from './components/layout'
import Main from './components/pages/Main'

function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
        </Switch>
      </Router>
    </Layout>
  )
}

export default App

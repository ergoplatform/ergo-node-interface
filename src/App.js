import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { ApiKeyContext } from './context/context'
import Router from './router/router'

import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/index.scss'
import 'react-toastify/dist/ReactToastify.min.css'

toast.configure()

class App extends Component {
  constructor(props) {
    super(props)

    this.setApikey = apiKey => {
      this.setState(prevState => ({
        apiKey: { ...prevState.apiKey, value: apiKey },
      }))
    }

    this.state = {
      apiKey: {
        value: '',
        setApiKey: this.setApikey,
      },
    }
  }

  render() {
    return (
      <ApiKeyContext.Provider value={this.state.apiKey}>
        <Router />
      </ApiKeyContext.Provider>
    )
  }
}

export default App

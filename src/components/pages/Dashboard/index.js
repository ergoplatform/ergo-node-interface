import React, { Fragment, Component } from 'react'
import SynchCard from '../../elements/SynchCard'
import { nodeApi } from '../../../api/api'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nodeInfo: null
    }
  }

  componentDidMount() {
    this.setCurrentState()
    this.setTimer()
  }

  getNodeCurrentState = () => nodeApi.get('/info')

  setCurrentState = async () => {
    const { data: nodeInfo } = await this.getNodeCurrentState()
    this.setState({ nodeInfo })
  }

  setTimer = () => {
    const timerId = setInterval(this.setCurrentState, 5000)
    this.setState({ timerId })
  }

  render() {
    if (this.state.nodeInfo === null) {
      return <p className="pl-3 pt-0">Loading...</p>
    }

    return (
      <Fragment>
        <p className="pl-3 pt-0 h5 mb-3">Dashboard</p>
        <hr />
        <SynchCard nodeInfo={this.state.nodeInfo}></SynchCard>
      </Fragment>
    )
  }
}

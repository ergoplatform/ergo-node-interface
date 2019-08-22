import React, { Component } from 'react'
import Card from '../common/Card'
import CircularProgress from '@material-ui/core/CircularProgress'
import DoneIcon from '@material-ui/icons/Done'
import './index.scss'
import { nodeApi } from '../../../api/api'

export default class SynchCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      synchronizationState: 'start'
    }
  }

  renderActiveSynchronization = () => (
    <Card color="orange" className="synch-card">
      <div className="synch-card__container">
        <CircularProgress color="inherit" className="synch-card__icon" />
        Active synchronization
      </div>
    </Card>
  )

  renderCompleteSynchronization = () => (
    <Card color="green" className="synch-card">
      <div className="synch-card__container">
        <DoneIcon color="inherit" className="synch-card__icon--complete" />
        The node is synchronized
      </div>
    </Card>
  )

  renderStartSynchronization = () => (
    <Card className="synch-card">
      <div className="synch-card__container">
        <CircularProgress color="primary" className="synch-card__icon" />
        Getting current node state
      </div>
    </Card>
  )

  renderSynchronizationState = state =>
    ({
      start: this.renderStartSynchronization,
      active: this.renderActiveSynchronization,
      complete: this.renderCompleteSynchronization
    }[state])

  getNodeCurrentState = async () => {
    const { data } = await nodeApi.get('/info')
    let currentSynchronizationState = ''

    if (data.fullHeight === data.headersHeight) {
      currentSynchronizationState = 'complete'
    } else {
      currentSynchronizationState = 'active'
    }

    return currentSynchronizationState
  }

  setCurrentState = async () => {
    const currentSyncState = await this.getNodeCurrentState()
    this.setState({ synchronizationState: currentSyncState })
  }

  setTimer = () => {
    const timerId = setInterval(this.setCurrentState, 5000)
    this.setState({ timerId })
  }

  componentDidMount() {
    this.setCurrentState()
    this.setTimer()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.synchronizationState !== this.state.synchronizationState) {
      return true
    }

    return false
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId)
  }

  render() {
    return this.renderSynchronizationState(this.state.synchronizationState)()
  }
}

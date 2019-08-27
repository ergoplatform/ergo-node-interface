import React, { Component } from 'react'
import Card from '../common/Card'
import './index.scss'

export default class SynchCard extends Component {
  renderActiveSynchronization = () => (
    <Card className="synch-card bg-warning">
      <div className="synch-card__container">Active synchronization</div>
    </Card>
  )

  renderCompleteSynchronization = () => (
    <Card className="synch-card bg-success text-white">
      <div className="synch-card__container">The node is synchronized</div>
    </Card>
  )

  renderSynchronizationState = state =>
    ({
      start: this.renderStartSynchronization,
      active: this.renderActiveSynchronization,
      complete: this.renderCompleteSynchronization
    }[state])

  getSynchronizationState = ({ fullHeight, headersHeight }) => {
    if (fullHeight === headersHeight) {
      return 'complete'
    }

    return 'active'
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.getSynchronizationState(nextProps) !==
      this.getSynchronizationState(this.props.nodeInfo)
    ) {
      return true
    }

    return false
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId)
  }

  render() {
    const currentSynchState = this.getSynchronizationState(this.props.nodeInfo)
    return (
      <div className="col-4">
        {this.renderSynchronizationState(currentSynchState)()}
      </div>
    )
  }
}

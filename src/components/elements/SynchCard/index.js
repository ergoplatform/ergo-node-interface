import React, { Component } from 'react'
import Card from '../common/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync, faCheck } from '@fortawesome/free-solid-svg-icons'
import './index.scss'

export default class SynchCard extends Component {
  renderActiveSynchronization = () => (
    <>
      <p className="card__title">Current node state</p>
      <p className="card__label">
        <FontAwesomeIcon icon={faSync} spin></FontAwesomeIcon> Active
        synchronization
      </p>
    </>
  )

  renderCompleteSynchronization = () => (
    <>
      <p className="card__title">Current node state</p>
      <p className="card__label text-success">
        <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> Node is synced
      </p>
    </>
  )

  renderSynchronizationState = state =>
    ({
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
      <Card className={this.props.className}>
        {this.renderSynchronizationState(currentSynchState)()}
      </Card>
    )
  }
}

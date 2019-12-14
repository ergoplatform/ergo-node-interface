import React, { Fragment, Component } from 'react'
import {
  faExclamationTriangle,
  faSync,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import InfoCard from '../../common/InfoCard'
import SynchCard from '../../elements/SynchCard'
import nodeApi from '../../../api/api'

export default class Dashboard extends Component {
  state = {
    nodeInfo: null,
    error: null,
  }

  componentDidMount() {
    this.setNodeCurrentState()
    this.setTimer()
  }

  getNodeCurrentState = () => nodeApi.get('/info')

  setNodeCurrentState = async () => {
    try {
      const { data: nodeInfo } = await this.getNodeCurrentState()
      this.setState({ nodeInfo, error: null })
    } catch {
      this.setState({ error: 'Node connection is lost.' })
    }
  }

  setTimer = () => {
    const timerId = setInterval(this.setNodeCurrentState, 2000)
    this.setState({ timerId })
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId)
  }

  render() {
    if (this.state.error !== null) {
      return (
        <Fragment>
          <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
            <h3 className="text-danger">
              <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>
              &nbsp;
              {this.state.error}
            </h3>
          </div>
        </Fragment>
      )
    }

    if (this.state.nodeInfo === null) {
      return (
        <Fragment>
          <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
            <FontAwesomeIcon
              className="h1"
              icon={faSync}
              spin
            ></FontAwesomeIcon>
          </div>
        </Fragment>
      )
    }

    const {
      peersCount,
      bestHeaderId,
      launchTime,
      fullHeight,
      appVersion,
      isMining,
    } = this.state.nodeInfo

    return (
      <Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-3 p-0 border-right mb-3">
              <InfoCard className="card rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Node version</p>
                <p className="info-card__label">{appVersion}</p>
              </InfoCard>
            </div>
            <div className="col-3 p-0 border-right mb-3">
              <SynchCard
                nodeInfo={this.state.nodeInfo}
                className="border-bottom"
              ></SynchCard>
            </div>
            <div className="col-3 p-0 border-right mb-3">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Node started at</p>
                <p className="info-card__label">
                  {format(new Date(launchTime), 'MM-dd-yyyy HH:mm:ss')}
                </p>
              </InfoCard>
            </div>
            {fullHeight === null ? null : (
              <div className="col-3 p-0 border-right mb-3">
                <InfoCard className="rounded-0 shadow-none border-bottom">
                  <p className="info-card__title">Current height</p>
                  <p className="info-card__label">{fullHeight}</p>
                </InfoCard>
              </div>
            )}
            {bestHeaderId === null ? null : (
              <div className="col-3 p-0 border-right mb-3">
                <InfoCard className="rounded-0 shadow-none border-bottom">
                  <p className="info-card__title">Best block id</p>
                  <p className="info-card__label">{bestHeaderId}</p>
                </InfoCard>
              </div>
            )}
            <div className="col-3 p-0 border-right mb-3">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Mining enabled</p>
                <p className="info-card__label">
                  {isMining ? 'true' : 'false'}
                </p>
              </InfoCard>
            </div>
            <div className="col-3 p-0 border-right mb-3">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Peers connected</p>
                <p className="info-card__label">{peersCount}</p>
              </InfoCard>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

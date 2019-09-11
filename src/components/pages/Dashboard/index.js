import React, { Fragment, Component } from 'react'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import InfoCard from '../../common/InfoCard'
import SynchCard from '../../elements/SynchCard'
import nodeApi from '../../../api/api'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nodeInfo: null,
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
    const timerId = setInterval(this.setCurrentState, 3000)
    this.setState({ timerId })
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId)
  }

  render() {
    if (this.state.nodeInfo === null) {
      return <Fragment></Fragment>
    }

    if (this.state.nodeInfo && this.state.nodeInfo.fullHeight === null) {
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
          <div className="row mb-3">
            <div className="col-3 p-0 border-right">
              <InfoCard className="card rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Node version</p>
                <p className="info-card__label">{appVersion}</p>
              </InfoCard>
            </div>
            <div className="col-3 p-0 border-right">
              <SynchCard
                nodeInfo={this.state.nodeInfo}
                className="border-bottom"
              ></SynchCard>
            </div>
            <div className="col-3 p-0 border-right">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Current height</p>
                <p className="info-card__label">{fullHeight}</p>
              </InfoCard>
            </div>
            <div className="col-3 p-0">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Best block id</p>
                <p className="info-card__label">{bestHeaderId}</p>
              </InfoCard>
            </div>
          </div>
          <div className="row">
            <div className="col-3 p-0 border-right">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Node started at</p>
                <p className="info-card__label">
                  {format(new Date(launchTime), 'MM-dd-yyyy HH:mm:ss')}
                </p>
              </InfoCard>
            </div>
            <div className="col-3 p-0 border-right">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Mining enabled</p>
                <p className="info-card__label">
                  {isMining ? 'true' : 'false'}
                </p>
              </InfoCard>
            </div>
            <div className="col-3 p-0 border-right">
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

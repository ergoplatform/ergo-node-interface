import React, { Fragment, Component } from 'react'
import SynchCard from '../../elements/SynchCard'
import InfoCard from '../../elements/common/InfoCard'
import { format } from 'date-fns'
import { nodeApi } from '../../../api/api'
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
    const timerId = setInterval(this.setCurrentState, 5000)
    this.setState({ timerId })
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId)
  }

  render() {
    if (this.state.nodeInfo === null) {
      return <></>
    }

    const {
      peersCount,
      headersHeight,
      bestHeaderId,
      launchTime,
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
                <p className="info-card__label">{headersHeight}</p>
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

import React, { Fragment, Component } from 'react'
import SynchCard from '../../elements/SynchCard'
import Card from '../../elements/common/Card'
import { format } from 'date-fns'
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
      return (
        <Fragment>
          <p className="pl-3 pt-0 h5 mb-3">Dashboard</p>
          <hr />
          <p className="pl-3 pt-0">Loading...</p>
        </Fragment>
      )
    }

    const {
      peersCount,
      headersHeight,
      bestHeaderId,
      launchTime,
      appVersion
    } = this.state.nodeInfo

    return (
      <Fragment>
        <p className="pl-3 pt-0 h5 mb-3">Dashboard</p>
        <hr />
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-3 p-0 border-right">
              <Card className="rounded-0 shadow-none border-bottom">
                <p className="card__title">Node version</p>
                <p className="card__label">{appVersion}</p>
              </Card>
            </div>
            <div className="col-3 p-0 border-right">
              <SynchCard
                nodeInfo={this.state.nodeInfo}
                className="border-bottom"
              ></SynchCard>
            </div>
            <div className="col-3 p-0 border-right">
              <Card className="rounded-0 shadow-none border-bottom">
                <p className="card__title">Current height</p>
                <p className="card__label">{headersHeight}</p>
              </Card>
            </div>
            <div className="col-3 p-0">
              <Card className="rounded-0 shadow-none border-bottom">
                <p className="card__title">Best block id</p>
                <p className="card__label">{bestHeaderId}</p>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-3 p-0 border-right">
              <Card className="rounded-0 shadow-none border-bottom">
                <p className="card__title">Node started at</p>
                <p className="card__label">
                  {format(new Date(launchTime), 'MM-dd-yyyy HH:mm:ss')}
                </p>
              </Card>
            </div>
            <div className="col-3 p-0 border-right">
              <Card className="rounded-0 shadow-none border-bottom">
                <p className="card__title">Peers connected</p>
                <p className="card__label">{peersCount}</p>
              </Card>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

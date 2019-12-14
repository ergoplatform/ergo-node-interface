import React, { Fragment } from 'react'
import {
  faExclamationTriangle,
  faSync,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import InfoCard from './InfoCard'
import SynchCard from './SynchCard'

const getWalletStatus = (isWalletInitialized, isWalletUnlocked) => {
  if (!isWalletInitialized) {
    return 'Not initialized'
  }

  if (!isWalletUnlocked) {
    return 'Initialized'
  }

  return 'Unlocked'
}

const DashboardView = ({
  error,
  nodeInfo,
  isWalletInitialized,
  isWalletUnlocked,
  apiKey,
}) => {
  if (error !== null) {
    return (
      <Fragment>
        <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
          <h3 className="text-danger">
            <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>
            &nbsp;
            {error}
          </h3>
        </div>
      </Fragment>
    )
  }

  if (nodeInfo === null) {
    return (
      <Fragment>
        <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
          <FontAwesomeIcon className="h1" icon={faSync} spin></FontAwesomeIcon>
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
  } = nodeInfo

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
              nodeInfo={nodeInfo}
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
              <p className="info-card__label">{isMining ? 'true' : 'false'}</p>
            </InfoCard>
          </div>
          <div className="col-3 p-0 border-right mb-3">
            <InfoCard className="rounded-0 shadow-none border-bottom">
              <p className="info-card__title">Peers connected</p>
              <p className="info-card__label">{peersCount}</p>
            </InfoCard>
          </div>
          {apiKey !== '' && (
            <div className="col-3 p-0 border-right mb-3">
              <InfoCard className="rounded-0 shadow-none border-bottom">
                <p className="info-card__title">Wallet status</p>
                <p className="info-card__label">
                  {getWalletStatus(isWalletInitialized, isWalletUnlocked)}
                </p>
              </InfoCard>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default DashboardView

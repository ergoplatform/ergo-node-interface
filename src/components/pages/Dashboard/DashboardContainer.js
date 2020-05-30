import React, { useState, useEffect, useCallback, memo } from 'react'
import { connect } from 'react-redux'
import nodeApi from '../../../api/api'
import DashboardView from './DashboardView'
import {
  isWalletInitializedSelector,
  isWalletUnlockedSelector,
} from '../../../store/selectors/wallet'
import { apiKeySelector } from '../../../store/selectors/app'
import usePrevious from '../../../hooks/usePrevious'
import walletActions from '../../../store/actions/walletActions'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
  isWalletUnlocked: isWalletUnlockedSelector(state),
})

const mapDispatchToProps = dispatch => ({
  dispatchCheckWalletStatus: () => dispatch(walletActions.checkWalletStatus()),
})

const DashboardContainer = props => {
  const {
    isWalletInitialized,
    isWalletUnlocked,
    apiKey,
    dispatchCheckWalletStatus,
  } = props

  const [nodeInfo, setNodeInfo] = useState(null)
  const [error, setError] = useState(null)
  const [timerId, setTimerId] = useState(null)

  const getNodeCurrentState = () => nodeApi.get('/info')

  const setNodeCurrentState = useCallback(async () => {
    try {
      const { data } = await getNodeCurrentState()

      setNodeInfo(data)
      setError(null)
    } catch {
      setError('Node connection is lost.')
    }
  }, [])

  const setTimer = useCallback(() => {
    const newTimerId = setInterval(setNodeCurrentState, 2000)

    setTimerId(newTimerId)
  }, [setNodeCurrentState])

  const prevError = usePrevious(error)
  useEffect(() => {
    if (prevError && prevError !== error) {
      dispatchCheckWalletStatus()
    }
  }, [dispatchCheckWalletStatus, error, prevError])

  useEffect(() => {
    setNodeCurrentState()
    setTimer()
    return () => clearInterval(timerId)
    // eslint-disable-next-line
  }, [])

  return (
    <DashboardView
      error={error}
      nodeInfo={nodeInfo}
      isWalletInitialized={isWalletInitialized}
      isWalletUnlocked={isWalletUnlocked}
      apiKey={apiKey}
    />
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(memo(DashboardContainer))

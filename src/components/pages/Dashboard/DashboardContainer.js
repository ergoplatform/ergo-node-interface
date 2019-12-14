import React, { useState, useEffect, useCallback, memo } from 'react'
import { connect } from 'react-redux'
import nodeApi from '../../../api/api'
import DashboardView from './DashboardView'
import {
  isWalletInitializedSelector,
  isWalletUnlockedSelector,
} from '../../../store/selectors/wallet'
import { apiKeySelector } from '../../../store/selectors/app'

const mapStateToProps = state => ({
  apiKey: apiKeySelector(state),
  isWalletInitialized: isWalletInitializedSelector(state),
  isWalletUnlocked: isWalletUnlockedSelector(state),
})

const DashboardContainer = props => {
  const { isWalletInitialized, isWalletUnlocked, apiKey } = props

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

export default connect(mapStateToProps)(memo(DashboardContainer))

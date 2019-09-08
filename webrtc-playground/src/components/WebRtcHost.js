import React, { useCallback, useReducer } from 'react'

import WebRtcConfig from './WebRtcConfig'

import { useStateValue, CONSTANT } from '../AppContext'

export default props => {
  const [{ roomId, mode, connection, appStep }, dispatch] = useStateValue()
  const [rtcConfig, dispatchRtcConfig] = useReducer((state, val) => {
    return {
      ...state,
      ...val
    }
  }, {})

  const onRtcConfigChange = useCallback(
    val => {
      dispatchRtcConfig(val)
    },
    [dispatchRtcConfig]
  )

  // UI Callback
  const onStart = useCallback(() => {
    console.log('Create peer with', rtcConfig)
    connection.start({ mode, simplePeerConfig: rtcConfig, signalRoom: roomId })
    dispatch({
      type: CONSTANT.EACTION.setAppStep,
      value: CONSTANT.ESTEP.CONNECTING
    })
  }, [connection, rtcConfig, mode, roomId, dispatch])

  const enable = appStep === CONSTANT.ESTEP.NOT_CONNECT

  return (
    <fieldset disabled={!enable}>
      <WebRtcConfig onChange={onRtcConfigChange} />
      <div className="field">
        <div className="field">
          <button className="button is-primary" onClick={onStart}>
            Start
          </button>
        </div>
      </div>
    </fieldset>
  )
}

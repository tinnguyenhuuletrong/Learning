import React, { useCallback, useState, useMemo, useReducer } from 'react'
import SimplePeer from 'simple-peer'
import { toast } from 'bulma-toast'
import copy from 'copy-to-clipboard'

import WebRtcConfig from './WebRtcConfig'

import { useStateValue, CONSTANT } from '../AppContext'
import connectionMonitor from '../utils/connectionMonitor'

const copyClipboard = data => {
  copy(data)
  toast({
    message: 'copied',
    type: 'is-info',
    animate: { in: 'fadeIn', out: 'fadeOut' }
  })
}

export default props => {
  const [{ appStep, mode, connection, eventSource }, dispatch] = useStateValue()

  const [subStep, setSubStep] = useState(1)
  const [inputSignalData, setInputSignalData] = useState('')
  const [answerToHost, dispatchAnswerToHost] = useReducer((state, val) => {
    return [...state, val]
  }, [])
  const [rtcConfig, dispatchRtcConfig] = useReducer((state, val) => {
    return {
      ...state,
      ...val
    }
  }, {})

  const stepLock = useMemo(() => {
    const isEnable =
      appStep === CONSTANT.ESTEP.NOT_CONNECT &&
      mode === CONSTANT.ECLIENT_MODE.PEER
    return { disabled: !isEnable }
  }, [appStep, mode])

  // Effect
  connectionMonitor(connection, eventSource, dispatch)

  // UI Callback
  const doConnect = useCallback(() => {
    console.log('Create peer with', rtcConfig)
    console.log('begin connect ', inputSignalData)
    const p = new SimplePeer({
      initiator: false,
      ...rtcConfig
    })

    const signalHandler = data => {
      const newSignalData = data
      dispatchAnswerToHost(newSignalData)
    }
    p.on('signal', signalHandler)

    try {
      const arr = JSON.parse(inputSignalData)
      if (!Array.isArray(arr)) throw new Error('Input signal must be aray')

      arr.forEach(itm => p.signal(itm))

      setSubStep(2)
      dispatch({
        type: CONSTANT.EACTION.updateConenction,
        value: p
      })
    } catch (error) {
      console.error(error)
    }
  }, [inputSignalData, dispatchAnswerToHost, setSubStep, dispatch])

  const copyAnswerDataClipboard = useCallback(() => {
    copyClipboard(JSON.stringify(answerToHost))
  }, [answerToHost])

  const onRtcConfigChange = useCallback(
    val => {
      dispatchRtcConfig(val)
    },
    [dispatchRtcConfig]
  )

  return (
    <fieldset {...stepLock}>
      <WebRtcConfig onChange={onRtcConfigChange} />
      <div className="field">
        <label className="label">SignalData from Host</label>
        <div className={['control'].join(' ')}>
          <textarea
            className={['textarea', 'is-small'].join(' ')}
            value={inputSignalData}
            onChange={e => setInputSignalData(e.target.value)}
          />
        </div>
      </div>
      {subStep === 1 && (
        <div className="field">
          <button className="button is-primary" onClick={doConnect}>
            Connect
          </button>
        </div>
      )}
      {subStep === 2 && (
        <div className="field">
          <label className="label">
            Answer To Host{' '}
            <a
              className="button is-rounded is-small"
              onClick={copyAnswerDataClipboard}
            >
              <i className="far fa-clipboard" />
            </a>
          </label>
          <div className={['control'].join(' ')}>
            <textarea
              className={['textarea', 'is-small'].join(' ')}
              readOnly
              value={JSON.stringify(answerToHost)}
            />
          </div>
        </div>
      )}
    </fieldset>
  )
}

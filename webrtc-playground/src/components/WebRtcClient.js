import React, { useCallback, useState, useMemo } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'
import connectionMonitor from '../utils/connectionMonitor'

import SimplePeer from 'simple-peer'

export default props => {
  const [{ appStep, mode, connection, eventSource }, dispatch] = useStateValue()

  const [subStep, setSubStep] = useState(1)
  const [inputSignalData, setInputSignalData] = useState('')
  const [answerToHost, setAnswerToHost] = useState('')

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
    console.log('begin connect ', inputSignalData)
    const p = new SimplePeer({
      initiator: false,
      trickle: false
    })
    p.on('signal', data => {
      setAnswerToHost(JSON.stringify(data))
    })
    p.signal(inputSignalData)
    setSubStep(2)

    dispatch({
      type: CONSTANT.EACTION.updateConenction,
      value: p
    })
  }, [inputSignalData, setAnswerToHost, setSubStep, dispatch])

  return (
    <fieldset {...stepLock}>
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
          <label className="label">Answer To Host</label>
          <div className={['control'].join(' ')}>
            <textarea
              className={['textarea', 'is-small'].join(' ')}
              disabled
              value={answerToHost}
              onChange={e => setAnswerToHost(e.target.value)}
            />
          </div>
        </div>
      )}
    </fieldset>
  )
}

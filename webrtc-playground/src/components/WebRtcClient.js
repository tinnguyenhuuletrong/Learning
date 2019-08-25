import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'
import connectionMonitor from '../utils/connectionMonitor'

import SimplePeer from 'simple-peer'

export default props => {
  const [{ appStep, mode, connection, eventSource }, dispatch] = useStateValue()

  const [subStep, setSubStep] = useState(1)
  const [inputSignalData, setInputSignalData] = useState('')
  const [answerToHost, setAnswerToHost] = useState([])

  const stepLock = useMemo(() => {
    const isEnable =
      appStep === CONSTANT.ESTEP.NOT_CONNECT &&
      mode === CONSTANT.ECLIENT_MODE.PEER
    return { disabled: !isEnable }
  }, [appStep, mode])

  // Effect
  connectionMonitor(connection, eventSource, dispatch)

  // Offer signal
  useEffect(() => {
    if (!connection) return
    const signalHandler = data => {
      const newSignalData = data
      setAnswerToHost([...answerToHost, newSignalData])
      setSubStep(2)
    }
    connection.on('signal', signalHandler)
    return () => {
      connection.off('signal', signalHandler)
    }
  }, [connection, answerToHost, setSubStep])

  // UI Callback
  const doConnect = useCallback(() => {
    console.log('begin connect ', inputSignalData)
    const p = new SimplePeer({
      initiator: false,
      trickle: false
    })
    try {
      const arr = JSON.parse(inputSignalData)
      if (!Array.isArray(arr)) throw new Error('Input signal must be aray')

      arr.forEach(itm => p.signal(itm))

      dispatch({
        type: CONSTANT.EACTION.updateConenction,
        value: p
      })
    } catch (error) {
      console.error(error)
    }
  }, [inputSignalData, dispatch])

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
              readOnly
              value={JSON.stringify(answerToHost)}
            />
          </div>
        </div>
      )}
    </fieldset>
  )
}

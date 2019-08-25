import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'
import connectionMonitor from '../utils/connectionMonitor'

import SimplePeer from 'simple-peer'

export default props => {
  const [{ appStep, mode, connection, eventSource }, dispatch] = useStateValue()

  const [subStep, setSubStep] = useState(1)
  const [hostSignalData, setHostSignalData] = useState([])
  const [hostAnswer, setHostAnswer] = useState('')

  const stepLock = useMemo(() => {
    const isEnable =
      appStep === CONSTANT.ESTEP.NOT_CONNECT &&
      mode === CONSTANT.ECLIENT_MODE.HOST
    return { disabled: !isEnable }
  }, [appStep, mode])

  // Effect
  connectionMonitor(connection, eventSource, dispatch)

  // Offer signal
  useEffect(() => {
    if (!connection) return
    const signalHandler = data => {
      const newSignalData = data
      setHostSignalData([...hostSignalData, newSignalData])
      setSubStep(2)
    }
    connection.on('signal', signalHandler)
    return () => {
      connection.off('signal', signalHandler)
    }
  }, [connection, hostSignalData, setHostSignalData, setSubStep])

  // UI Callback
  const createNew = useCallback(() => {
    const p = new SimplePeer({
      initiator: true
      // trickle: false
    })
    dispatch({
      type: CONSTANT.EACTION.updateConenction,
      value: p
    })
  }, [dispatch])

  const submitAnswer = useCallback(() => {
    try {
      console.log('submit answer', hostAnswer)
      const arr = JSON.parse(hostAnswer)
      if (!Array.isArray(arr)) throw new Error('Input signal must be aray')

      arr.forEach(itm => connection.signal(itm))
    } catch (error) {
      console.error(error)
    }
  }, [hostAnswer, connection])

  return (
    <fieldset {...stepLock}>
      <div className="field">
        <label className="label">Host Signal Data</label>
        <div
          className={['control', hostSignalData ? '' : 'is-loading'].join(' ')}
        >
          <textarea
            className={['textarea', 'is-small'].join(' ')}
            disabled
            value={JSON.stringify(hostSignalData)}
          ></textarea>
        </div>
      </div>
      {subStep === 1 && (
        <div className="field">
          <button className="button is-primary" onClick={createNew}>
            Generate
          </button>
        </div>
      )}
      {subStep >= 2 && (
        <React.Fragment>
          <div className="field">
            <label className="label">Answer</label>
            <div className={['control'].join(' ')}>
              <textarea
                className={['textarea', 'is-small'].join(' ')}
                value={hostAnswer}
                onChange={e => setHostAnswer(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" onClick={submitAnswer}>
              Connect
            </button>
          </div>
        </React.Fragment>
      )}
    </fieldset>
  )
}

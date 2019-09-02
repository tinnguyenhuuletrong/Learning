import React, {
  useCallback,
  useMemo,
  useReducer,
  useState,
  useEffect
} from 'react'
import SimplePeer from 'simple-peer'
import { toast } from 'bulma-toast'
import copy from 'copy-to-clipboard'

import WebRtcConfig from './WebRtcConfig'

import { useStateValue, CONSTANT } from '../AppContext'
import connectionMonitor from '../utils/connectionMonitor'

const copyClipboard = data => {
  copy(data)
  toast({
    message: 'copied - sync with firebase',
    type: 'is-info',
    animate: { in: 'fadeIn', out: 'fadeOut' }
  })
}

export default props => {
  const [
    {
      appStep,
      roomId,
      mode,
      mineMedia,
      connection,
      eventSource,
      firebaseDatabase
    },
    dispatch
  ] = useStateValue()

  const [subStep, setSubStep] = useState(1)
  const [hostSignalData, dispatchHostSignalData] = useReducer((state, val) => {
    return [...state, val]
  }, [])
  const [hostAnswer, setHostAnswer] = useState('')
  const [rtcConfig, dispatchRtcConfig] = useReducer((state, val) => {
    return {
      ...state,
      ...val
    }
  }, {})

  // Compute stepLock
  const stepLock = useMemo(() => {
    const isEnable =
      appStep === CONSTANT.ESTEP.NOT_CONNECT &&
      mode === CONSTANT.ECLIENT_MODE.HOST
    return { disabled: !isEnable }
  }, [appStep, mode])

  // Effect
  connectionMonitor(connection, eventSource, dispatch)

  // UI Callback
  const createNew = useCallback(() => {
    console.log('Create peer with', rtcConfig)
    const p = new SimplePeer({
      initiator: true,
      stream: mineMedia ? mineMedia : false,
      ...rtcConfig
    })

    const signalHandler = data => {
      const newSignalData = data
      dispatchHostSignalData(newSignalData)
    }
    p.on('signal', signalHandler)

    setSubStep(2)
    dispatch({
      type: CONSTANT.EACTION.updateConenction,
      value: p
    })
  }, [dispatch, mineMedia, rtcConfig])

  // Effect - update answer from firebase
  useEffect(() => {
    const roomRef = `/room/${roomId}/answer`
    const answerRef = firebaseDatabase.ref(roomRef)

    const updateAnswerFromFirebase = value => {
      const { data } = value.val() || {}
      if (data) {
        setHostAnswer(data)
        toast({
          message: 'answer - sync from firebase',
          type: 'is-info',
          animate: { in: 'fadeIn', out: 'fadeOut' }
        })
      }
    }

    answerRef.on('value', updateAnswerFromFirebase)
    return () => {
      answerRef.off('value', updateAnswerFromFirebase)
    }
  }, [roomId, firebaseDatabase, setHostAnswer])

  // Submit answer
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

  // Copy to clipboard
  const copyHostDataClipboard = useCallback(() => {
    const hostSignalDataStr = JSON.stringify(hostSignalData)
    copyClipboard(hostSignalDataStr)

    const roomRef = `/room/${roomId}/hostSignal`
    firebaseDatabase.ref(roomRef).set({ data: hostSignalDataStr })
  }, [hostSignalData, roomId, firebaseDatabase])

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
        <label className="label">
          Host Signal Data{' '}
          <a
            className="button is-rounded is-small"
            onClick={copyHostDataClipboard}
          >
            <i className="far fa-clipboard" />
          </a>
        </label>
        <div
          className={['control', hostSignalData ? '' : 'is-loading'].join(' ')}
        >
          <textarea
            className={['textarea', 'is-small'].join(' ')}
            readOnly
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

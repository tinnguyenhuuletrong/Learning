import React, { useEffect, useState, useCallback } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ eventSource, connection }] = useStateValue()
  const [enable, setEnable] = useState(false)
  const [inputMsg, setInputMsg] = useState([])

  useEffect(() => {
    const msgLogConnect = () => setEnable(true)
    const msgLogClose = () => setEnable(false)

    eventSource.on('connect', msgLogConnect)
    eventSource.on('close', msgLogClose)

    return () => {
      eventSource.off('connect', msgLogConnect)
      eventSource.off('close', msgLogClose)
    }
  }, [eventSource, setEnable])

  const onMsgChangeCallback = useCallback(val => setInputMsg(val), [
    setInputMsg
  ])

  const onSendTextMsg = useCallback(() => {
    connection.send(inputMsg)
    eventSource.emit('action-send-text', inputMsg)
  }, [inputMsg, connection, eventSource])

  return (
    <fieldset disabled={!enable}>
      <div className="columns">
        <div className="column is-11">
          <input
            className="input"
            type="text"
            placeholder="message to send"
            value={inputMsg}
            onChange={e => onMsgChangeCallback(e.target.value)}
          />
        </div>
        <div className="column">
          <button className="button is-info" onClick={onSendTextMsg}>
            Send
          </button>
        </div>
      </div>
    </fieldset>
  )
}

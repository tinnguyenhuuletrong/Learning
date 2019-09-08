import React, { useState, useCallback } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ eventSource, connection, appStep }] = useStateValue()
  const [inputMsg, setInputMsg] = useState([])

  const onMsgChangeCallback = useCallback(val => setInputMsg(val), [
    setInputMsg
  ])

  const onSendTextMsg = useCallback(() => {
    connection.send(inputMsg)
    eventSource.emit('action-send-text', inputMsg)
    onMsgChangeCallback('')
  }, [inputMsg, connection, eventSource, onMsgChangeCallback])

  const enable = appStep === CONSTANT.ESTEP.CONNECTED

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
            onKeyPress={e => {
              if (!e) e = window.event
              var keyCode = e.keyCode || e.which
              if (String(keyCode) === '13') {
                onSendTextMsg(e.target.value)
                return false
              }
            }}
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

import React, { useEffect, useState } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ eventSource }] = useStateValue()
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const msgLog = msg => () => {
      setLogs([
        ...logs,
        {
          _time: new Date(),
          content: msg
        }
      ])
    }
    const msgLogConnect = msgLog('connected')
    const msgLogError = msgLog('error')
    const msgLogClose = msgLog('disconnected')

    const msgSendTextMsg = textMsg => msgLog(`Send -> ${textMsg}`)()
    const msgLogWithData = msg => msgLog(`Recv -> ${msg}`)()

    eventSource.on('connect', msgLogConnect)
    eventSource.on('error', msgLogError)
    eventSource.on('data', msgLogWithData)
    eventSource.on('close', msgLogClose)

    eventSource.on('action-send-text', msgSendTextMsg)

    return () => {
      eventSource.off('connect', msgLogConnect)
      eventSource.off('error', msgLogError)
      eventSource.off('data', msgLogWithData)
      eventSource.off('close', msgLogClose)
    }
  }, [logs, setLogs, eventSource])

  return (
    <div className="column is-full">
      <div
        className="container has-background-grey-lighter is-size-7"
        style={{
          minHeight: '50vh',
          maxHeight: '50vh',
          overflowY: 'auto',
          padding: '5px 10px'
        }}
      >
        {logs.map(({ content, _time }, index) => (
          <p key={index}>
            {String(_time)} - {String(content)}
          </p>
        ))}
      </div>
    </div>
  )
}

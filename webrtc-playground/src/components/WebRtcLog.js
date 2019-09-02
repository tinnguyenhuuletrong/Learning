import React, { useEffect, useState } from 'react'
import { useStateValue } from '../AppContext'

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ eventSource, connection }] = useStateValue()
  const [logs, setLogs] = useState([])
  const [rtcStats, setRtcStats] = useState([])

  // Refresh connection stats
  useEffect(() => {
    if (!connection) return
    const intervalTicket = setInterval(async () => {
      if (!connection) return clearInterval(intervalTicket)
      connection.getStats((err, stats = []) => {
        setRtcStats(
          stats.map(({ type, id, timestamp, ...others }) => ({
            type,
            id,
            timestamp,
            others
          }))
        )
      })
    }, 1000)
    return () => clearInterval(intervalTicket)
  }, [connection])

  // Subcrible events
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
      <h3>RTC Status Logs - {rtcStats.length}</h3>
      <div
        className="container has-background-white-bis is-size-7"
        style={{
          minHeight: '50vh',
          maxHeight: '50vh',
          overflowY: 'auto',
          padding: '5px 10px'
        }}
      >
        {rtcStats.map(({ type, id, timestamp, others }, index) => (
          <div className="content" key={id}>
            <p>
              {index}) Type: <strong>{String(type)}</strong> - Id: {String(id)}
            </p>
            <ul>
              {Object.keys(others).map((key, index) => (
                <li key={index}>
                  {String(key)}: {String(others[key])}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <hr />
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

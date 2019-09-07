import React, { useEffect, useState } from 'react'

import { useStateValue } from '../AppContext'

function transformSignalLog(item) {
  const { from, data, _t } = item
  return {
    _time: _t,
    title: `[SIGNAL] ${from}`,
    content: `${JSON.stringify(data)}`
  }
}

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ connection, eventSource }] = useStateValue()
  const [logs, setLogs] = useState(
    connection.signalLogs.map(itm => transformSignalLog(itm))
  )
  const [rtcStats, setRtcStats] = useState([])

  // Refresh connection stats
  useEffect(() => {
    const intervalTicket = setInterval(async () => {
      try {
        const stats = await connection.getPeerStats()
        if (stats) {
          setRtcStats(
            stats.reverse().map(({ type, id, timestamp, ...others }) => ({
              type,
              id,
              timestamp,
              others
            }))
          )
        }
      } catch (error) {}
    }, 1000)
    return () => clearInterval(intervalTicket)
  }, [connection])

  // Subcrible events
  useEffect(() => {
    const msgLog = (msg, title = '') => () => {
      setLogs([
        {
          _time: new Date(),
          title,
          content: msg
        },
        ...logs
      ])
    }

    const signalLog = msg => {
      setLogs([transformSignalLog(msg), ...logs])
    }

    const msgLogConnect = msgLog('connected')
    const msgLogError = msgLog('error')
    const msgLogClose = msgLog('disconnected')

    const msgSendTextMsg = textMsg => msgLog(`Send -> ${textMsg}`)()
    const msgLogWithData = msg => msgLog(`Recv -> ${msg}`)()

    connection.on('connect', msgLogConnect)
    connection.on('error', msgLogError)
    connection.on('data', msgLogWithData)
    connection.on('close', msgLogClose)

    connection.on('signalLog', signalLog)
    eventSource.on('action-send-text', msgSendTextMsg)

    return () => {
      connection.off('connect', msgLogConnect)
      connection.off('error', msgLogError)
      connection.off('data', msgLogWithData)
      connection.off('close', msgLogClose)

      connection.off('signalLog', signalLog)
      eventSource.off('action-send-text', msgSendTextMsg)
    }
  }, [logs, setLogs, connection, eventSource])

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
        {logs.map(({ content, title = '', _time }, index) => (
          <div className="content" key={index}>
            <p>
              - {_time.toISOString()} <strong>{String(title)}</strong> -{' '}
              <small>{String(content)}</small>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

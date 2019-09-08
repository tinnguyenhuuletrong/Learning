import React, { useEffect, useState } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'

const COLOR_MAP = {
  connecting: 'is-link',
  connected: 'is-primary',
  error: 'is-danger',
  disconnected: 'is-warning'
}

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ connection }, dispatch] = useStateValue()
  const [status, setStatus] = useState('connecting')
  const [connectionInfo, setConnectionInfo] = useState({})

  useEffect(() => {
    const onChangeStatus = status => setStatus(status)
    connection.on('connect', e => {
      onChangeStatus('connected')
      setTimeout(() => {
        const { peer } = connection
        const { localAddress = '', localFamily = '', localPort = '' } = peer
        const { remoteAddress = '', remoteFamily = '', remotePort = '' } = peer

        setConnectionInfo({
          local: `${localFamily} - ${localAddress}:${localPort}`,
          remote: `${remoteFamily} - ${remoteAddress}:${remotePort}`
        })

        dispatch({
          type: CONSTANT.EACTION.setAppStep,
          value: CONSTANT.ESTEP.CONNECTED
        })
      }, 1000)
    })
    connection.on('close', e => {
      connection.reset()
      onChangeStatus('disconnected')
      setConnectionInfo({})
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.DISCONNECT
      })
    })
    connection.on('error', e => onChangeStatus('error'))
  }, [connection, setConnectionInfo, dispatch])

  return (
    <article className={['message', COLOR_MAP[status]].join(' ')}>
      <div className="message-body">
        <p className="is-capitalized">{status}</p>
        <p className="is-size-7 is-italic	">
          Local: {connectionInfo.local && `${connectionInfo.local}`}
        </p>
        <p className="is-size-7 is-italic	">
          Remote: {connectionInfo.remote && `${connectionInfo.remote}`}
        </p>
      </div>
    </article>
  )
}

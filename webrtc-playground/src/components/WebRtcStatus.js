import React, { useEffect, useState } from 'react'
import { useStateValue } from '../AppContext'

const COLOR_MAP = {
  connecting: 'is-link',
  connected: 'is-primary',
  error: 'is-danger',
  disconnected: 'is-warning'
}

export default ({ defaultIndex = 0, tabs = [] }) => {
  const [{ eventSource }] = useStateValue()
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const onChangeStatus = status => setStatus(status)
    eventSource.on('connect', e => onChangeStatus('connected'))
    eventSource.on('close', e => onChangeStatus('disconnected'))
    eventSource.on('error', e => onChangeStatus('error'))
  }, [eventSource])

  return (
    <article className={['message', COLOR_MAP[status]].join(' ')}>
      <div className="message-body">
        <p className="is-capitalized">{status}</p>
      </div>
    </article>
  )
}

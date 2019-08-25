import { useEffect } from 'react'

export default (connection, eventSource) => {
  useEffect(() => {
    if (!connection) return

    const errorHandler = err => eventSource.emit('error', err)
    const connectHandler = () => eventSource.emit('connect')
    const dataHandler = data => eventSource.emit('data', data)
    connection.on('error', errorHandler)
    connection.on('connect', connectHandler)
    connection.on('data', dataHandler)
    return () => {
      connection.off('error', errorHandler)
      connection.off('connect', connectHandler)
      connection.off('data', dataHandler)
    }
  }, [connection, eventSource])
}

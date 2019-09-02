import { useEffect } from 'react'
import { CONSTANT } from '../AppContext'

export default (connection, eventSource, dispatch) => {
  useEffect(() => {
    if (!connection) return

    const errorHandler = err => eventSource.emit('error', err)
    const connectHandler = () => {
      eventSource.emit('connect')
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.CONNECTED
      })
    }
    const closeHandler = () => {
      eventSource.emit('close')
      dispatch({
        type: CONSTANT.EACTION.setAppStep,
        value: CONSTANT.ESTEP.NOT_CONNECT
      })
    }
    const dataHandler = data => eventSource.emit('data', data)

    connection.on('error', errorHandler)
    connection.on('connect', connectHandler)
    connection.on('data', dataHandler)
    connection.on('close', closeHandler)
    connection.on('stream', stream => console.log('stream', stream))

    return () => {
      connection.off('error', errorHandler)
      connection.off('connect', connectHandler)
      connection.off('data', dataHandler)
      connection.off('close', closeHandler)
    }
  }, [connection, eventSource])
}

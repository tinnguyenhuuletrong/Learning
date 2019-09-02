import React, { useEffect, useState, useCallback } from 'react'
import { useStateValue } from '../AppContext'
import { toast } from 'bulma-toast'
import VideoPlayer from './VideoPlayer'

export default props => {
  const [{ eventSource, mineMedia, connection }] = useStateValue()
  const [enable, setEnable] = useState(false)
  const [otherStream, setOtherStream] = useState(null)

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

  // Other stream
  useEffect(() => {
    if (!connection) return
    const incomingStream = stream => {
      toast({
        message: `video stream recived`,
        type: 'is-info',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      })
      setOtherStream(stream)
    }
    connection.on('stream', incomingStream)
    return () => {
      connection.off('stream', incomingStream)
    }
  }, [connection, setOtherStream])

  return (
    <fieldset>
      <div className="columns is-multiline is-centered">
        <div className="column is-12">
          <div className="columns is-centered">
            <div className="column is-6">
              <p>Me</p>
              <VideoPlayer stream={mineMedia} />
            </div>
            <div className="column is-6">
              <p>Other</p>
              <VideoPlayer stream={otherStream} />
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  )
}

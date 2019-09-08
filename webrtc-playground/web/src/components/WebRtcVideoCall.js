import React, { useEffect, useState, useCallback } from 'react'
import { useStateValue, CONSTANT } from '../AppContext'
import { toast } from 'bulma-toast'
import VideoPlayer from './VideoPlayer'

const MediaOptions = { video: true }

export default props => {
  const [{ mineMedia, connection, appStep }, dispatch] = useStateValue()
  const [otherStream, setOtherStream] = useState(null)

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

  // Gather Media
  const onGatherVideoCallback = useCallback(() => {
    const gotMedia = stream => {
      // Add Stream
      connection.peer.addStream(stream)

      dispatch({
        type: CONSTANT.EACTION.setMineMedia,
        value: stream
      })
    }
    if (!navigator) {
      return toast({
        message: `error - navigator not support`,
        type: 'is-error',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      })
    }
    // get video/voice stream
    navigator.mediaDevices.getUserMedia(MediaOptions, gotMedia, err => {
      toast({
        message: `error - ${err.message}`,
        type: 'is-error',
        animate: { in: 'fadeIn', out: 'fadeOut' }
      })
    })
  }, [dispatch, connection.peer])

  const enable = appStep === CONSTANT.ESTEP.CONNECTED

  return (
    <fieldset disabled={!enable}>
      <div className="columns is-multiline is-centered">
        <div className="column is-full">
          <fieldset>
            <div className="field is-grouped is-grouped-centered">
              <button
                className="button is-success"
                onClick={onGatherVideoCallback}
              >
                With Media
              </button>
            </div>
          </fieldset>
        </div>
        <hr />
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

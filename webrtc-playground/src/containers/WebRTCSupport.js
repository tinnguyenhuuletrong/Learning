import React, { useEffect, useState } from 'react'
import DetectRTC from 'detectrtc'
import { useStateValue, CONSTANT } from '../AppContext'

export default ({ expectedMode, children }) => {
  const [{ supportWebRTC }, dispatch] = useStateValue()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    DetectRTC.load(() => {
      dispatch({
        type: CONSTANT.EACTION.updateWebRTCSupport,
        value: DetectRTC.isWebRTCSupported
      })
      setChecking(false)
    })
  }, [dispatch])

  return (
    <React.Fragment>
      {checking ? null : supportWebRTC ? (
        children
      ) : (
        <article class="message is-danger">
          <div class="message-body">Browser don't support WebRTC</div>
        </article>
      )}
    </React.Fragment>
  )
}

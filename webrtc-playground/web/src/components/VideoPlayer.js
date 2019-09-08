import React, { useRef, useEffect } from 'react'
export default ({ stream }) => {
  const videoRef = useRef(null)
  useEffect(() => {
    if (!videoRef.current || !stream) return
    const video = videoRef.current
    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }
    try {
      video.play()
    } catch (error) {
      console.error(error)
    }
  }, [stream])
  return (
    <>
      <video ref={videoRef} />
    </>
  )
}

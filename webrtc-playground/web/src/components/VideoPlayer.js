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
  }, [stream])
  return (
    <>
      <video ref={videoRef} controls autoPlay playsInline />
    </>
  )
}

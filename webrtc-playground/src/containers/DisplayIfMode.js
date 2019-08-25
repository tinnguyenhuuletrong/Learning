import React from 'react'
import { useStateValue } from '../AppContext'

export default ({ expectedMode, children }) => {
  const [{ mode }] = useStateValue()

  return (
    <React.Fragment>{expectedMode === mode ? children : null}</React.Fragment>
  )
}

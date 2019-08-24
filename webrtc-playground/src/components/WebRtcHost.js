import React, { useContext, useCallback, useState } from 'react'
import AppContext from '../AppContext'

import SimplePeer from 'simple-peer'

export default props => {
  const context = useContext(AppContext)
  const [signalData, setSignalData] = useState(context.signalData)

  const createNew = useCallback(() => {
    context.reset()
    const p = new SimplePeer({
      initiator: true,
      trickle: false
    })
    p.on('error', err => console.log('error', err))
    p.on('signal', data => {
      const newSignalData = JSON.stringify(data)

      setSignalData(newSignalData)
      context.setConnection(p)
      context.setMode('host')
      context.setSignalData(newSignalData)
    })
  }, [context, setSignalData])

  return (
    <React.Fragment>
      <div className="field">
        <label className="label">Signal Data</label>
        <div className={['control', signalData ? '' : 'is-loading'].join(' ')}>
          <textarea
            className={['textarea', 'is-small'].join(' ')}
            disabled
            value={signalData}
          ></textarea>
        </div>
      </div>
      <div className="field">
        <button className="button is-primary" onClick={createNew}>
          Create
        </button>
      </div>
    </React.Fragment>
  )
}

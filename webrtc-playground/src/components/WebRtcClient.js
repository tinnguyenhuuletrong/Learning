import React, { useContext, useCallback, useState } from 'react'
import AppContext from '../AppContext'

import SimplePeer from 'simple-peer'

export default props => {
  const context = useContext(AppContext)
  const [isLoading, setLoading] = useState(false)
  const [signalData, setSignalData] = useState('')
  const doConnect = useCallback(() => {
    context.reset()
    console.log('begin connect ', signalData)
    setLoading(true)
    const p = new SimplePeer({
      initiator: false,
      trickle: false
    })
    p.on('error', err => {
      console.log('error', err)
      setLoading(false)
    })
    p.on('connect', () => {
      console.log('CONNECT')
      context.setConnection(p)
      context.setMode('peer')
      setLoading(false)
    })
    p.on('signal', data => {
      console.log('aaaa', data)
    })
    p.signal(signalData)
  }, [context, signalData, setLoading])

  return (
    <React.Fragment>
      <div className="field">
        <label className="label">Host Data</label>
        <div className={['control', isLoading ? '' : 'is-loading'].join(' ')}>
          <textarea
            className={['textarea', 'is-small'].join(' ')}
            value={signalData}
            onChange={e => setSignalData(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <button className="button is-primary" onClick={doConnect}>
          Connect
        </button>
      </div>
    </React.Fragment>
  )
}

import React from 'react'
import useIpfsFactory from './hooks/use-ipfs-factory.js'
import useIpfs from './hooks/use-ipfs.js'
import useIpfsPeers from './hooks/use-ipfs-peer.js'
import logo from './ipfs-logo.svg'

const App = () => {
  const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] })
  const id = useIpfs(ipfs, 'id')
  const peers = useIpfsPeers(ipfs)
  return (
    <div className="sans-serif">
      <header className="flex items-center pa3 bg-navy bb bw3 b--aqua">
        <a href="https://ipfs.io" title="home">
          <img
            alt="IPFS logo"
            src={logo}
            style={{ height: 50 }}
            className="v-top"
          />
        </a>
        <h1 className="flex-auto ma0 tr f3 fw2 montserrat aqua">IPFS React</h1>
      </header>
      <main>
        {ipfsInitError && (
          <div className="bg-yellow pa4 mw7 center mv4 white">
            Error: {ipfsInitError.message || ipfsInitError}
          </div>
        )}
        {id && <IpfsId {...id} />}
        {peers && peers.length && <IpfsPeer peers={peers} />}
      </main>
    </div>
  )
}

const Title = ({ children }) => {
  return <h2 className="f5 ma0 pb2 tracked aqua fw4 montserrat">{children}</h2>
}

const IpfsId = props => {
  if (!props) return null
  return (
    <section className="bg-snow mw8 center mt5">
      <h1 className="f3 fw4 ma0 pv3 aqua montserrat tc">Connected to IPFS</h1>
      <div className="pa4">
        {['id', 'agentVersion', 'addresses'].map(key => (
          <div className="mb4" key={key}>
            <Title>{key}</Title>
            <div className="bg-white pa2 br2  monospace">{props[key]}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const IpfsPeer = ({ peers }) => {
  if (!peers) return null
  return (
    <section className="bg-snow mw8 center mt5">
      <h1 className="f3 fw4 ma0 pv3 aqua montserrat tc">
        Peers ({peers.length})
      </h1>

      <div className="pa3">
        {peers.map((itm, i) => (
          <li className="bg-white pa2 br2 truncate monospace" key={i}>
            {itm}
          </li>
        ))}
      </div>
    </section>
  )
}

export default App

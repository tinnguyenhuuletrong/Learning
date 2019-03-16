import React, { useState, useEffect } from 'react'
import useIpfsFactory from './hooks/use-ipfs-factory.js'
import useIpfs from './hooks/use-ipfs.js'
import useIpfsPeers from './hooks/use-ipfs-peer.js'
import logo from './ipfs-logo.svg'
import SnackBar from './Snackbar'
import { EventEmitter } from 'events'

const SubMessageEmitter = new EventEmitter()
const PubSubInsCache = {}

function tryParseJson(rawData) {
  try {
    return JSON.parse(rawData)
  } catch (error) {
    return null
  }
}

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
        {Boolean(ipfs) && <Subcrible ipfs={ipfs} />}
        {Boolean(ipfs) && <Publish ipfs={ipfs} />}
        {Boolean(ipfs) && <ConnectToPeer ipfs={ipfs} />}
        {Boolean(peers && peers.length) && <IpfsPeer peers={peers} />}
      </main>
      <SnackBar />
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
            <div className="bg-white pa2 br2 truncate monospace">
              {props[key]}
            </div>
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

const ConnectToPeer = ({ ipfs }) => {
  const [connectToAddr, setConnectToAddr] = useState('')

  const _connectToMultiAddr = async multiaddr => {
    if (!multiaddr) {
      return console.error('No multiaddr was inserted.')
    }

    ipfs.swarm
      .connect(multiaddr)
      .then(() => {
        window.showMessage(`Successfully connected to peer.`)
      })
      .catch(e => {
        console.error(e)
        window.showMessage('An error occurred when connecting to the peer.')
      })
  }

  return (
    <section className="bg-snow mw8 center mt5">
      <h1 className="f3 fw4 ma0 pv3 aqua montserrat tc">Connect To</h1>

      <div className="pa3">
        <Title>Multiaddr</Title>
        <div className="bg-white pa2 br2">
          <input
            id="multiaddr-input"
            type="text"
            placeholder="Multiaddr"
            value={connectToAddr}
            style={{ width: '100%' }}
            onChange={e => {
              setConnectToAddr(e.target.value)
            }}
          />
        </div>
        <center>
          <button
            id="peer-btn"
            style={{ margin: 10 }}
            onClick={e => {
              _connectToMultiAddr(connectToAddr)
            }}
          >
            Connect
          </button>
        </center>
      </div>
    </section>
  )
}

const Subcrible = ({ ipfs, defaultTopic = ['#general'] }) => {
  const [subTo, setSubTo] = useState('')
  const [topics, setTopics] = useState([])

  const _onMessageCallback = topic => msg => {
    SubMessageEmitter.emit('message', { topic, msg })
  }

  const _refreshTopic = async () => {
    ipfs.pubsub
      .ls()
      .then(topics => {
        setTopics(topics)
      })
      .catch(e =>
        window.showMessage('An error occurred when connecting to the peer.')
      )
  }

  const _subTo = async subTo => {
    if (!subTo) {
      return console.error('No topic.')
    }
    if (PubSubInsCache[subTo]) {
      return console.error('Already subcrible topic')
    }

    const handler = _onMessageCallback(subTo)

    ipfs.pubsub
      .subscribe(subTo, handler)
      .then(() => {
        window.showMessage(`Successfully`)
        PubSubInsCache[subTo] = handler
        _refreshTopic()
      })
      .catch(e => {
        console.error(e)
        window.showMessage('An error occurred.')
      })
  }

  const _unSubTo = async subTo => {
    if (!subTo) {
      return console.error('No multiaddr was inserted.')
    }
    if (!PubSubInsCache[subTo]) {
      return console.error('Not yet subcrible to topic')
    }

    ipfs.pubsub
      .unsubscribe(subTo, PubSubInsCache[subTo])
      .then(() => {
        window.showMessage(`Successfully`)
        delete PubSubInsCache[subTo]
        _refreshTopic()
      })
      .catch(e => {
        console.error(e)
        window.showMessage('An error occurred.')
      })
  }

  useEffect(
    _ => {
      _refreshTopic()
      defaultTopic.forEach(topic => _subTo(topic))
    },
    [ipfs]
  )

  return (
    <section className="bg-snow mw8 center mt5">
      <h1 className="f3 fw4 ma0 pv3 aqua montserrat tc">Subcrible</h1>

      <div className="pa3">
        <Title>Topics ({topics.length})</Title>

        {topics.map((itm, i) => (
          <li className="bg-white pa2 br2 truncate monospace" key={i}>
            {itm.toString()}
          </li>
        ))}
      </div>

      <div className="pa3">
        <Title>Add & Remove</Title>
        <div className="bg-white pa2 br2">
          <input
            id="multiaddr-input"
            type="text"
            placeholder="Topic Name"
            value={subTo}
            style={{ width: '100%' }}
            onChange={e => {
              setSubTo(e.target.value)
            }}
          />
        </div>
        <center>
          <button
            style={{ margin: 10 }}
            onClick={e => {
              _subTo(subTo)
            }}
          >
            Subcrible
          </button>
          <button
            style={{ margin: 10 }}
            onClick={e => {
              _unSubTo(subTo)
            }}
          >
            UnSubcrible
          </button>
        </center>
      </div>
    </section>
  )
}

const Publish = ({ ipfs, defaultTopicName = '#general' }) => {
  const [sendTopic, setSendTopic] = useState(defaultTopicName)
  const [sendMessage, setSendMessage] = useState('')
  const [logList, setLogList] = useState([])

  const _publishMessage = async ({ topic, message }) => {
    if (!PubSubInsCache[topic]) {
      return console.error('Not yet subcrible to topic')
    }

    ipfs.pubsub
      .publish(topic, ipfs.types.Buffer.from(message))
      .then(() => {})
      .catch(e => {
        console.error(e)
        window.showMessage('An error occurred.')
      })
  }

  useEffect(
    _ => {
      const onMessage = ({ topic, msg }) => {
        const rawMsg = msg.data.toString()
        const itm = {
          topic,
          rawMsg,
          msg: tryParseJson(rawMsg)
        }
        console.log(topic, ' -> ', msg)
        setLogList([itm, ...logList])
      }

      SubMessageEmitter.on('message', onMessage)
      return e => SubMessageEmitter.off('message', onMessage)
    },
    [ipfs, logList]
  )

  return (
    <section className="bg-snow mw8 center mt5">
      <h1 className="f3 fw4 ma0 pv3 aqua montserrat tc">Publish</h1>

      <div className="pa3">
        <Title>Send To Topic</Title>
        <div className="bg-white pa2 br2">
          <input
            id="multiaddr-input"
            type="text"
            placeholder="Topic Name"
            value={sendTopic}
            style={{ width: '50%' }}
            onChange={e => {
              setSendTopic(e.target.value)
            }}
          />
        </div>

        <Title>With Message</Title>
        <div className="bg-white pa2 br2">
          <input
            id="multiaddr-input"
            type="text"
            placeholder="Content"
            value={sendMessage}
            style={{ width: '100%' }}
            onChange={e => {
              setSendMessage(e.target.value)
            }}
          />
        </div>
        <center>
          <button
            style={{ margin: 10 }}
            onClick={e => {
              _publishMessage({ topic: sendTopic, message: sendMessage })
            }}
          >
            Send
          </button>
        </center>

        <Title>Received messages ({logList.length})</Title>

        {logList.map((itm, i) => (
          <li className="bg-white pa2 br2 truncate monospace" key={i}>
            {`${itm.topic.toString()} - ${itm.rawMsg}`}
          </li>
        ))}
      </div>
    </section>
  )
}

export default App

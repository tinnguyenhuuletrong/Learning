import { useState, useEffect } from 'react'

export default function useIpfsPeers(ipfs, refreshInterval = 2000) {
  const [peers, setPeers] = useState([])
  useEffect(() => {
    const ticket = setInterval(async () => {
      if (!ipfs) return
      const peerInfo = await ipfs.swarm.peers()
      setPeers(peerInfo.map(itm => itm.addr.toString()))
    }, refreshInterval)

    return _ => clearInterval(ticket)
  }, [ipfs])
  return peers
}

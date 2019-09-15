import {EventEmitter} from 'events';
// import SimplePeer from 'simple-peer';
import SimplePeer from '../../../vendors/simple-peer';
import * as wrtc from 'react-native-webrtc';

class WebRTCPeer extends EventEmitter {
  static MODE = {
    HOST: 'HOST',
    PEER: 'PEER',
  };

  constructor(signalChannel) {
    super();
    this.signalChannel = signalChannel;
    this.reset();
  }

  reset() {
    this.signalChannel.disconnect();
    this.unsubcrible();
    if (this.peer) {
      this.peer.destroy();
    }
    this.peer = null;
    this.mode = null;
    this.signalLogs = [];
  }

  start({mode, simplePeerConfig = {}, signalRoom}) {
    this.mode = mode;
    this.peer = new SimplePeer({
      initiator: this.mode === WebRTCPeer.MODE.HOST,
      wrtc: wrtc,
      ...simplePeerConfig,
    });
    this.signalChannel.connect({signalRoom, mode});
    this.subcrible();
  }

  subcrible() {
    this.peer.on('signal', this._onNewSignal);

    this.signalChannel.on('message', this._onChannelMessage);

    const events = ['error', 'connect', 'data', 'close', 'stream'];
    events.forEach(key => {
      const handlerName = `$on${key}`;
      this[handlerName] = this._eventForward(key);
      this.peer.on(key, this[handlerName]);
    });
  }

  unsubcrible() {
    if (!this.peer) {
      return;
    }

    this.signalChannel.off('message', this._onChannelMessage);
    this.signalChannel.disconnect();

    this.peer.off('signal', this._onNewSignal);
    const events = ['error', 'connect', 'data', 'close', 'stream'];
    events.forEach(key => {
      const handlerName = `$on${key}`;
      this.peer.off(key, this[handlerName]);
    });
  }

  getPeerStats() {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        return null;
      }
      this.peer.getStats((err, stats = []) => {
        if (err) {
          return reject(err);
        }
        resolve(stats);
      });
    });
  }

  send(data) {
    if (!this.peer) {
      return null;
    }
    this.peer.send(data);
  }

  _addSendSignalLog = data => {
    const newMsg = {
      from: this.mode,
      data,
      _t: new Date(),
    };
    this.signalLogs.push(newMsg);

    this.emit('signalLog', newMsg);
  };

  _addReceiveSignalLog = data => {
    const other =
      this.mode === WebRTCPeer.MODE.HOST
        ? WebRTCPeer.MODE.PEER
        : WebRTCPeer.MODE.HOST;
    const newMsg = {
      from: other,
      data,
      _t: new Date(),
    };
    this.signalLogs.push(newMsg);

    this.emit('signalLog', newMsg);
  };

  //-------------------------------------------------------//
  //  Event handler
  //-------------------------------------------------------//

  _onNewSignal = data => {
    this._addSendSignalLog(data);
    const to =
      this.mode === WebRTCPeer.MODE.HOST
        ? WebRTCPeer.MODE.PEER
        : WebRTCPeer.MODE.HOST;

    this.signalChannel.send(to, data);
  };

  _onChannelMessage = data => {
    this._addReceiveSignalLog(data);
    this.peer.signal(data);
  };

  _eventForward = name => data => {
    this.emit(name, data);
  };
}

export default WebRTCPeer;

import {EventEmitter} from 'events';

class FirebaseSignalChannel extends EventEmitter {
  constructor(database) {
    super();
    this.database = database;
    this.reset();
  }

  reset() {
    this.unsubcrible();
    this.signalRoom = null;
    this.incommingBufferRef = null;
  }

  async connect({signalRoom, mode}) {
    this.signalRoom = signalRoom;
    const name = `rooms/${signalRoom}/buffer_${mode}`;
    this.refName = name;
    this.incommingBufferRef = this.database.ref(name);
    this.incommingBufferRef.on('child_added', this._onMessage);
  }

  disconnect() {
    this.reset();
  }

  send = (to, data) => {
    if (!this.signalRoom) {
      throw new Error('call connect(..) first');
    }
    const name = `rooms/${this.signalRoom}/buffer_${to}`;
    const bufferRef = this.database.ref(name);
    bufferRef.push(data);
  };

  unsubcrible() {
    if (this.incommingBufferRef) {
      this.incommingBufferRef.remove();
      this.incommingBufferRef.off('child_added', this._onMessage);
    }
  }

  //-------------------------------------------------------//
  //  Event handler
  //-------------------------------------------------------//

  _onMessage = snapshot => {
    const data = snapshot.val();
    this.emit('message', data);
  };
}

export default FirebaseSignalChannel;

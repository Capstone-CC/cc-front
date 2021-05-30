const baseURL = 'wss://cauconnect.com/api/socket'

const CONN_STATE = {
  CONNECTTING: 0,
  CONNECTED: 1,
  DISCONNECTTING: 2,
  DISCONNECTED: 3,
}

const PEER_STATE = {
  NEW: 'new',
  CONNECTTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FAILED: 'failed',
  CLOSED: 'closed',
}


export default class WebRTC {
  conn
  peerConnection
  dataChannel
  audioElement
  onSearch
  onCancel
  onMiss
  onConnect
  onDisconnect
  onCouple
  onTick
  onTicketCount
  onUserCount
  onAuth

  constructor(props) {
    const {audioElement, onSearch, onCancel, onMiss, onConnect, onDisconnect, onCouple, onTick, onTicketCount, onUserCount, onAuth} = props
    this.audioElement = audioElement
    this.onSearch = onSearch
    this.onCancel = onCancel
    this.onMiss = onMiss
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onCouple = onCouple
    this.onTick = onTick
    this.onTicketCount = onTicketCount
    this.onUserCount = onUserCount
    this.onAuth = onAuth

    this.initConn()
  }

  async search(option) {
    
    const callback = async () => {
      // 이미 있음
      console.log('already')
      if(this.peerConnection?.connectionState === PEER_STATE.NEW) return
      
      await this.initPeerConnection()
      const offer = await this.peerConnection.createOffer()
      this.peerConnection.setLocalDescription(offer);
      const result = this.sendSignal({
        event : 'offer',
        data : offer,
        option: option
      });
      if(result) this.onSearch()
    }

    if(this?.conn?.readyState !== CONN_STATE.CONNECTED) this.initConn(callback)
    else callback()
  }

  async handleOffer(offer) {
    await this.initPeerConnection()
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.peerConnection.createAnswer()
    this.peerConnection.setLocalDescription(answer);
    this.sendSignal({
      event : 'answer',
      data : answer
    });
  };

  handleCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  };

  handleAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  sendSignal(msg) {
    if(this.conn.readyState === CONN_STATE.CONNECTED){
      console.log('signal', msg)
      this.conn.send(JSON.stringify(msg))
      return true
    }
    return false
  }

  /**
   * Deprecated
   */
  sendMessage(msg) {
    this.dataChannel.send(msg);
  }

  initConn(callback) {
    this.conn = new WebSocket(baseURL);

    this.conn.onopen = () => {
      console.log('Connected to the signaling server');
      if(typeof callback === 'function') {
        callback()
      }
    };

    this.conn.onclose = e =>{
      console.log(e)
      console.log('Disconnected to the signaling server');
      this.initConn()
    };

    this.conn.onmessage = msg => {

      let content = JSON.parse(msg.data);
      let data = content.data;
      console.log(content.event, data)
      switch (content.event) {
        case 'offer':
          this.handleOffer(data);
          break;
        case 'answer':
          this.handleAnswer(data);
          break;
        case 'candidate':
          this.handleCandidate(data);
          break;
        case 'timer':
          this.onTick(data)
          break
        case 'client':
          this.onUserCount(data)
          break
        case 'ticket':
          this.onTicketCount(data)
          break
        case 'matching':
          this.onCouple(data)
          break
        case 'fail':
          break
        case 'notfound':
          if(typeof this.peerConnection?.close === 'function') {
            this.peerConnection?.close()
          }
          this.onMiss()
          break
        case 'notcookie':
          this.onAuth()
          break
        default:
      }
    };
  }

  async initPeerConnection() {
    let config = { 'iceServers' : [{ urls: 'stun:stun.l.google.com:19302' }] };

    this.peerConnection = new RTCPeerConnection(config);

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.sendSignal({
          event : 'candidate',
          data : event.candidate
        });
      }
    };

    this.peerConnection.ontrack = event => {
      console.log('got remote stream')
      const stream = new MediaStream();
      stream.addTrack(event.track, stream)
      this.audioElement.srcObject = stream;
    };

    this.peerConnection.onconnectionstatechange = event => {
      switch(this.peerConnection.connectionState) {
        case PEER_STATE.CONNECTTING:
          console.log('Connecting...')
          break;
        case PEER_STATE.CONNECTED:
          console.log('The connection has become fully connected')
          this.sendSignal({ event: 'connect' })
          this.onConnect()
          break;
        case PEER_STATE.DISCONNECTED:
          console.log('The connection has become disconnected')
          this.sendSignal({ event: 'disconnect' })
          this.onDisconnect()
          break;
        case PEER_STATE.FAILED:
          console.log('The connection has been failed')
          this.sendSignal({ event: 'disconnect' })
          this.onMiss()
          break;
        default:
          console.log(this.peerConnection.connectionState)
      }
    }
    
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
      console.log('got stream')
    } catch(e) {
      console.log(e)
    }

    /**
     * Deprecated
     */
    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
    };
  }

  /**
   * Deprecated
   */
  initDataChannel() {
    this.dataChannel = this.peerConnection.createDataChannel('dataChannel', {reliable : true});

    this.dataChannel.onerror = (error) => {
      console.log('Error occured on datachannel:', error);
    };
  
    this.dataChannel.onopen = () => {
      console.log('data channel is opened');
    };
  
    this.dataChannel.onclose = () => {
      console.log('data channel is closed');
    };

    this.dataChannel.onmessage = event => {
      console.log('message:', event.data);
    };
  }

  accept() {
    this.sendSignal({ event: 'accept' })
  }

  cancel() {
    if(typeof this.peerConnection?.close === 'function') {
      this.peerConnection?.close()
    }
    this.sendSignal({ event: 'cancel' })
    this.onCancel()
  }

  disconnect() {
    if(typeof this.peerConnection?.close === 'function') {
      this.peerConnection?.close()
    }
    this.sendSignal({ event : 'disconnect' });
    this.onDisconnect()
  }

  destruct() {
    if(this.conn?.onclose) {
      this.conn.onclose = () => {
        console.log('Disconnected to the signaling server');
      }
      this.conn.close()
    }
    
  }
}
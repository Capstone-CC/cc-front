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
  onMiss
  onConnect
  onDisconnect
  hasStream

  constructor(props) {
    const {audioElement, onSearch, onMiss, onConnect, onDisconnect} = props
    this.hasStream = false
    this.audioElement = audioElement
    this.onSearch = onSearch
    this.onMiss = onMiss
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.initConn()
    this.initPeerConnection()
  }

  async search() {
    if(this?.conn?.readyState !== CONN_STATE.CONNECTED) this.initConn()
    if(!this.hasStream) return false

    const offer = await this.peerConnection.createOffer()
    this.peerConnection.setLocalDescription(offer);
    this.sendSignal({
      event : 'offer',
      data : offer
    });
    this.onSearch()
    return true
  }

  async handleOffer(offer) {
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

  initConn() {
    this.conn = new WebSocket(baseURL);

    this.conn.onopen = () => {
      console.log('Connected to the signaling server');
    };

    this.conn.onclose = e =>{
      console.log(e)
      console.log('Disconnected to the signaling server');
    };

    this.conn.onmessage = msg => {
      let content = JSON.parse(msg.data);
      let data = content.data;
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
          this.onConnect()
          break;
        case PEER_STATE.DISCONNECTED:
          console.log('The connection has become disconnected')
          this.onDisconnect()
          break;
        case PEER_STATE.FAILED:
          console.log('The connection has been failed')
          this.onMiss()
          break;
        case PEER_STATE.CLOSED:
          console.log('The connection has been closed')
          this.onDisconnect()
          break;
        default:
          console.log(this.peerConnection.connectionState)
      }
    }
    
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
      this.hasStream = true
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

  close() {
    // if(this?.conn?.readyState === CONN_STATE.CONNECTED) this.conn.close()
    // if(this?.peerConnection?.connectionState === PEER_STATE.CONNECTED) this.peerConnection.close()
    this.onDisconnect()
  }
}
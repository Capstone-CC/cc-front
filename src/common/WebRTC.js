const baseURL = 'wss://cauconnect.com/api/socket'

export default class WebRTC {
  conn
  peerConnection
  dataChannel
  audioElement
  onSearch
  onMiss
  onConnect
  onDisconnect

  constructor(props) {
    const {audioElement, onSearch, onMiss, onConnect, onDisconnect} = props
    this.audioElement = audioElement
    this.onSearch = onSearch
    this.onMiss = onMiss
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.initConn()
    this.initPeerConnection()
    // this.initDataChannel()
  }

  createOffer() {
    this.peerConnection.createOffer(offer => {
      this.sendSignal({
        event : 'offer',
        data : offer
      });

      this.peerConnection.setLocalDescription(offer);
    }, () => {
      alert('Error creating an offer');
    });
  }

  handleOffer(offer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    this.peerConnection.createAnswer(answer => {
      this.peerConnection.setLocalDescription(answer);

      this.sendSignal({
        event : 'answer',
        data : answer
      });
    }, () => {
      alert('Error creating an answer');
    });
  };

  handleCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  };

  handleAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  sendSignal(msg) {
    this.conn.send(JSON.stringify(msg))
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

    this.conn.onclose = () =>{
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

  initPeerConnection() {
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
        case "connecting":
          console.log('Connecting...')
          this.onSearch()
          break;
        case "connected":
          console.log('The connection has become fully connected')
          this.onConnect()
          break;
        case "disconnected":
          console.log('The connection has become disconnected')
          this.onDisconnect()
          break;
        case "failed":
          console.log('The connection has been failed')
          this.onMiss()
          break;
        case "closed":
          console.log('The connection has been closed')
          this.onDisconnect()
          break;
        default:
          console.log(this.peerConnection.connectionState)
      }
    }
    
    navigator.mediaDevices.getUserMedia({
      audio: true,
    }).then(stream => {
      console.log('got stream')
      stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
    }).catch(error => {
      console.log(error)
    });

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
}
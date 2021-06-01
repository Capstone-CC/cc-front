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

    await this.getStream()

    const result = this.sendSignal({
      event : 'find',
      option: option
    });
    if(result) this.onSearch()

  }

  async handleOffer(offer) {
    await this.initPeerConnection()
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.peerConnection.createAnswer()
    this.sendSignal({
      event : 'answer',
      data : answer
    });
    await this.peerConnection.setLocalDescription(answer);
  };

  async handleCandidate(candidate) {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  };

  async handleAnswer(answer) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    await this.peerConnection.setLocalDescription(this.offer);
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

    this.conn.onmessage = async msg => {

      let content = JSON.parse(msg.data);
      let data = content.data;
      console.log(content.event, data)
      switch (content.event) {
        case 'found':
          await this.initPeerConnection()
          const offer = await this.peerConnection.createOffer()
          this.offer = offer
          this.sendSignal({
            event : 'offer',
            data : offer,
          });
          break;
        case 'offer':
          await this.handleOffer(data);
          break;
        case 'answer':
          if(!this.peerConnection?.connectionState) return console.log('no peerConnection')
          if(this.peerConnection?.connectionState === PEER_STATE.CLOSED) return console.log('blocked')
          await this.handleAnswer(data);
          break;
        case 'candidate':
          if(!this.peerConnection?.connectionState) return console.log('no peerConnection')
          if(this.peerConnection?.connectionState === PEER_STATE.CLOSED) return console.log('blocked')
          await this.handleCandidate(data);
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
    let config = { 'iceServers' : stunList };

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
          console.log(event)
          console.log('The connection has been failed')
          this.sendSignal({ event: 'disconnect' })
          this.onMiss()
          break;
        default:
          console.log(this.peerConnection.connectionState)
      }
    }
    
    try{
      await this.startStream()
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

  async getStream() {
    if(!this.stream){
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    }
    return this.stream
  }

  async offStream(){
    const stream = await this.getStream()
    stream.getTracks().forEach(track => track.enabled = false);
  }
  
  async onStream(){
    const stream = await this.getStream()
    stream.getTracks().forEach(track => track.enabled = true);
  }

  async startStream(){
    const stream = await this.getStream()
    stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
  }

  async stopStream(){
    const stream = await this.getStream()
    stream.getTracks().forEach(track => track.stop());
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

  report(data) {
    this.sendSignal({ event: 'report', data: data})
  }

  accept() {
    this.sendSignal({ event: 'accept' })
  }

  cancel() {
    if(typeof this.peerConnection?.close === 'function') {
      this.peerConnection?.close()
    }
    this.sendSignal({ event: 'cancel' })
    this.stopStream()
    this.onCancel()
  }

  disconnect() {
    if(typeof this.peerConnection?.close === 'function') {
      this.peerConnection?.close()
    }
    this.sendSignal({ event : 'disconnect' });
    this.stopStream()
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

const stunList = [{urls: 'stun:stun.1und1.de:3478'},
{urls: 'stun:stun.gmx.net:3478'},
{urls: 'stun:stun.l.google.com:19302'},
{urls: 'stun:stun1.l.google.com:19302'},
{urls: 'stun:stun2.l.google.com:19302'},
{urls: 'stun:stun3.l.google.com:19302'},
{urls: 'stun:stun4.l.google.com:19302'},
{urls: 'stun:iphone-stun.strato-iphone.de:3478'},
{urls: 'stun:stun.12connect.com:3478'},
{urls: 'stun:stun.12voip.com:3478'},
{urls: 'stun:stun.1und1.de:3478'},
{urls: 'stun:stun.2talk.co.nz:3478'},
{urls: 'stun:stun.2talk.com:3478'},
{urls: 'stun:stun.3clogic.com:3478'},
{urls: 'stun:stun.3cx.com:3478'},
{urls: 'stun:stun.a-mm.tv:3478'},
{urls: 'stun:stun.aa.net.uk:3478'},
{urls: 'stun:stun.acrobits.cz:3478'},
{urls: 'stun:stun.actionvoip.com:3478'},
{urls: 'stun:stun.advfn.com:3478'},
{urls: 'stun:stun.aeta-audio.com:3478'},
{urls: 'stun:stun.aeta.com:3478'},
{urls: 'stun:stun.altar.com.pl:3478'},
{urls: 'stun:stun.annatel.net:3478'},
{urls: 'stun:stun.antisip.com:3478'},
{urls: 'stun:stun.arbuz.ru:3478'},
{urls: 'stun:stun.avigora.fr:3478'},
{urls: 'stun:stun.awa-shima.com:3478'},
{urls: 'stun:stun.b2b2c.ca:3478'},
{urls: 'stun:stun.bahnhof.net:3478'},
{urls: 'stun:stun.barracuda.com:3478'},
{urls: 'stun:stun.bluesip.net:3478'},
{urls: 'stun:stun.bmwgs.cz:3478'},
{urls: 'stun:stun.botonakis.com:3478'},
{urls: 'stun:stun.budgetsip.com:3478'},
{urls: 'stun:stun.cablenet-as.net:3478'},
{urls: 'stun:stun.callromania.ro:3478'},
{urls: 'stun:stun.callwithus.com:3478'},
{urls: 'stun:stun.chathelp.ru:3478'},
{urls: 'stun:stun.cheapvoip.com:3478'},
{urls: 'stun:stun.ciktel.com:3478'},
{urls: 'stun:stun.cloopen.com:3478'},
{urls: 'stun:stun.comfi.com:3478'},
{urls: 'stun:stun.commpeak.com:3478'},
{urls: 'stun:stun.comtube.com:3478'},
{urls: 'stun:stun.comtube.ru:3478'},
{urls: 'stun:stun.cope.es:3478'},
{urls: 'stun:stun.counterpath.com:3478'},
{urls: 'stun:stun.counterpath.net:3478'},
{urls: 'stun:stun.datamanagement.it:3478'},
{urls: 'stun:stun.dcalling.de:3478'},
{urls: 'stun:stun.demos.ru:3478'},
{urls: 'stun:stun.develz.org:3478'},
{urls: 'stun:stun.dingaling.ca:3478'},
{urls: 'stun:stun.doublerobotics.com:3478'},
{urls: 'stun:stun.dus.net:3478'},
{urls: 'stun:stun.easycall.pl:3478'},
{urls: 'stun:stun.easyvoip.com:3478'},
{urls: 'stun:stun.ekiga.net:3478'},
{urls: 'stun:stun.epygi.com:3478'},
{urls: 'stun:stun.etoilediese.fr:3478'},
{urls: 'stun:stun.faktortel.com.au:3478'},
{urls: 'stun:stun.freecall.com:3478'},
{urls: 'stun:stun.freeswitch.org:3478'},
{urls: 'stun:stun.freevoipdeal.com:3478'},
{urls: 'stun:stun.gmx.de:3478'},
{urls: 'stun:stun.gmx.net:3478'},
{urls: 'stun:stun.gradwell.com:3478'},
{urls: 'stun:stun.halonet.pl:3478'},
{urls: 'stun:stun.hellonanu.com:3478'},
{urls: 'stun:stun.hoiio.com:3478'},
{urls: 'stun:stun.hosteurope.de:3478'},
{urls: 'stun:stun.ideasip.com:3478'},
{urls: 'stun:stun.infra.net:3478'},
{urls: 'stun:stun.internetcalls.com:3478'},
{urls: 'stun:stun.intervoip.com:3478'},
{urls: 'stun:stun.ipcomms.net:3478'},
{urls: 'stun:stun.ipfire.org:3478'},
{urls: 'stun:stun.ippi.fr:3478'},
{urls: 'stun:stun.ipshka.com:3478'},
{urls: 'stun:stun.irian.at:3478'},
{urls: 'stun:stun.it1.hr:3478'},
{urls: 'stun:stun.ivao.aero:3478'},
{urls: 'stun:stun.jumblo.com:3478'},
{urls: 'stun:stun.justvoip.com:3478'},
{urls: 'stun:stun.kanet.ru:3478'},
{urls: 'stun:stun.kiwilink.co.nz:3478'},
{urls: 'stun:stun.l.google.com:19302'},
{urls: 'stun:stun.linea7.net:3478'},
{urls: 'stun:stun.linphone.org:3478'},
{urls: 'stun:stun.liveo.fr:3478'},
{urls: 'stun:stun.lowratevoip.com:3478'},
{urls: 'stun:stun.lugosoft.com:3478'},
{urls: 'stun:stun.lundimatin.fr:3478'},
{urls: 'stun:stun.magnet.ie:3478'},
{urls: 'stun:stun.mgn.ru:3478'},
{urls: 'stun:stun.mit.de:3478'},
{urls: 'stun:stun.mitake.com.tw:3478'},
{urls: 'stun:stun.miwifi.com:3478'},
{urls: 'stun:stun.modulus.gr:3478'},
{urls: 'stun:stun.myvoiptraffic.com:3478'},
{urls: 'stun:stun.mywatson.it:3478'},
{urls: 'stun:stun.nas.net:3478'},
{urls: 'stun:stun.neotel.co.za:3478'},
{urls: 'stun:stun.netappel.com:3478'},
{urls: 'stun:stun.netgsm.com.tr:3478'},
{urls: 'stun:stun.nfon.net:3478'},
{urls: 'stun:stun.noblogs.org:3478'},
{urls: 'stun:stun.noc.ams-ix.net:3478'},
{urls: 'stun:stun.nonoh.net:3478'},
{urls: 'stun:stun.nottingham.ac.uk:3478'},
{urls: 'stun:stun.nova.is:3478'},
{urls: 'stun:stun.on.net.mk:3478'},
{urls: 'stun:stun.ooma.com:3478'},
{urls: 'stun:stun.ooonet.ru:3478'},
{urls: 'stun:stun.oriontelekom.rs:3478'},
{urls: 'stun:stun.outland-net.de:3478'},
{urls: 'stun:stun.ozekiphone.com:3478'},
{urls: 'stun:stun.personal-voip.de:3478'},
{urls: 'stun:stun.phone.com:3478'},
{urls: 'stun:stun.pjsip.org:3478'},
{urls: 'stun:stun.poivy.com:3478'},
{urls: 'stun:stun.powerpbx.org:3478'},
{urls: 'stun:stun.powervoip.com:3478'},
{urls: 'stun:stun.ppdi.com:3478'},
{urls: 'stun:stun.qq.com:3478'},
{urls: 'stun:stun.rackco.com:3478'},
{urls: 'stun:stun.rapidnet.de:3478'},
{urls: 'stun:stun.rb-net.com:3478'},
{urls: 'stun:stun.rixtelecom.se:3478'},
{urls: 'stun:stun.rockenstein.de:3478'},
{urls: 'stun:stun.rolmail.net:3478'},
{urls: 'stun:stun.rynga.com:3478'},
{urls: 'stun:stun.schlund.de:3478'},
{urls: 'stun:stun.services.mozilla.com:3478'},
{urls: 'stun:stun.sigmavoip.com:3478'},
{urls: 'stun:stun.sip.us:3478'},
{urls: 'stun:stun.sipdiscount.com:3478'},
{urls: 'stun:stun.sipgate.net:10000'},
{urls: 'stun:stun.sipgate.net:3478'},
{urls: 'stun:stun.siplogin.de:3478'},
{urls: 'stun:stun.sipnet.net:3478'},
{urls: 'stun:stun.sipnet.ru:3478'},
{urls: 'stun:stun.siportal.it:3478'},
{urls: 'stun:stun.sippeer.dk:3478'},
{urls: 'stun:stun.siptraffic.com:3478'},
{urls: 'stun:stun.skylink.ru:3478'},
{urls: 'stun:stun.sma.de:3478'},
{urls: 'stun:stun.smartvoip.com:3478'},
{urls: 'stun:stun.smsdiscount.com:3478'},
{urls: 'stun:stun.snafu.de:3478'},
{urls: 'stun:stun.softjoys.com:3478'},
{urls: 'stun:stun.solcon.nl:3478'},
{urls: 'stun:stun.solnet.ch:3478'},
{urls: 'stun:stun.sonetel.com:3478'},
{urls: 'stun:stun.sonetel.net:3478'},
{urls: 'stun:stun.sovtest.ru:3478'},
{urls: 'stun:stun.speedy.com.ar:3478'},
{urls: 'stun:stun.spokn.com:3478'},
{urls: 'stun:stun.srce.hr:3478'},
{urls: 'stun:stun.ssl7.net:3478'},
{urls: 'stun:stun.stunprotocol.org:3478'},
{urls: 'stun:stun.symform.com:3478'},
{urls: 'stun:stun.symplicity.com:3478'},
{urls: 'stun:stun.t-online.de:3478'},
{urls: 'stun:stun.tagan.ru:3478'},
{urls: 'stun:stun.teachercreated.com:3478'},
{urls: 'stun:stun.tel.lu:3478'},
{urls: 'stun:stun.telbo.com:3478'},
{urls: 'stun:stun.telefacil.com:3478'},
{urls: 'stun:stun.tng.de:3478'},
{urls: 'stun:stun.twt.it:3478'},
{urls: 'stun:stun.u-blox.com:3478'},
{urls: 'stun:stun.ucsb.edu:3478'},
{urls: 'stun:stun.ucw.cz:3478'},
{urls: 'stun:stun.uls.co.za:3478'},
{urls: 'stun:stun.unseen.is:3478'},
{urls: 'stun:stun.usfamily.net:3478'},
{urls: 'stun:stun.veoh.com:3478'},
{urls: 'stun:stun.vidyo.com:3478'},
{urls: 'stun:stun.vipgroup.net:3478'},
{urls: 'stun:stun.viva.gr:3478'},
{urls: 'stun:stun.vivox.com:3478'},
{urls: 'stun:stun.vline.com:3478'},
{urls: 'stun:stun.vo.lu:3478'},
{urls: 'stun:stun.vodafone.ro:3478'},
{urls: 'stun:stun.voicetrading.com:3478'},
{urls: 'stun:stun.voip.aebc.com:3478'},
{urls: 'stun:stun.voip.blackberry.com:3478'},
{urls: 'stun:stun.voip.eutelia.it:3478'},
{urls: 'stun:stun.voiparound.com:3478'},
{urls: 'stun:stun.voipblast.com:3478'},
{urls: 'stun:stun.voipbuster.com:3478'},
{urls: 'stun:stun.voipbusterpro.com:3478'},
{urls: 'stun:stun.voipcheap.co.uk:3478'},
{urls: 'stun:stun.voipcheap.com:3478'},
{urls: 'stun:stun.voipfibre.com:3478'},
{urls: 'stun:stun.voipgain.com:3478'},
{urls: 'stun:stun.voipgate.com:3478'},
{urls: 'stun:stun.voipinfocenter.com:3478'},
{urls: 'stun:stun.voipplanet.nl:3478'},
{urls: 'stun:stun.voippro.com:3478'},
{urls: 'stun:stun.voipraider.com:3478'},
{urls: 'stun:stun.voipstunt.com:3478'},
{urls: 'stun:stun.voipwise.com:3478'},
{urls: 'stun:stun.voipzoom.com:3478'},
{urls: 'stun:stun.vopium.com:3478'},
{urls: 'stun:stun.voxox.com:3478'},
{urls: 'stun:stun.voys.nl:3478'},
{urls: 'stun:stun.voztele.com:3478'},
{urls: 'stun:stun.vyke.com:3478'},
{urls: 'stun:stun.webcalldirect.com:3478'},
{urls: 'stun:stun.whoi.edu:3478'},
{urls: 'stun:stun.wifirst.net:3478'},
{urls: 'stun:stun.wwdl.net:3478'},
{urls: 'stun:stun.xs4all.nl:3478'},
{urls: 'stun:stun.xtratelecom.es:3478'},
{urls: 'stun:stun.yesss.at:3478'},
{urls: 'stun:stun.zadarma.com:3478'},
{urls: 'stun:stun.zadv.com:3478'},
{urls: 'stun:stun.zoiper.com:3478'},
{urls: 'stun:stun1.faktortel.com.au:3478'},
{urls: 'stun:stun1.l.google.com:19302'},
{urls: 'stun:stun1.voiceeclipse.net:3478'},
{urls: 'stun:stun2.l.google.com:19302'},
{urls: 'stun:stun3.l.google.com:19302'},
{urls: 'stun:stun4.l.google.com:19302'},
{urls: 'stun:stunserver.org:3478'}]
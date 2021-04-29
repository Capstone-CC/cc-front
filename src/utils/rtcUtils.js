let conn
let peerConnection
let dataChannel

const send = msg => {
  conn.send(JSON.stringify(msg));
}

const initConn = conn => {

  conn.onmessage = msg => {
    console.log("Got message", msg.data);
    let content = JSON.parse(msg.data);
    let data = content.data;
    switch (content.event) {
      // when somebody wants to call us
      case "offer":
        handleOffer(data);
        break;
      case "answer":
        handleAnswer(data);
        break;
      // when a remote peer sends an ice candidate to us
      case "candidate":
        handleCandidate(data);
        break;
      default:
    }
  };

  let config = {
    'iceServers' : [{
      'url' : 'stun:stun.l.google.com:19302'
    }]
  };

  /**
   * 간단한 RTCDataChannel 설정
   * 여기서는 stun만 설정
   */
  peerConnection = new RTCPeerConnection(config);

  /**
   * WebRTC는 ICE (Interactive Connection Establishment) 프로토콜을 사용하여 피어를 검색하고 연결을 설정
   * peerConnection 에 로컬 설명을 설정하면 icecandidate 이벤트가 트리거된다
   * remote Peer가 Set of remote candidates에 Candidate를 추가 할 수 있도록 candidate를 remote peer로 전송
   * 이를 위해 onicecandidate 이벤트에 대한 리스너를 만든다.
   *
   * ICE candidate의 모든 candidate가 수집 될 때 이벤트는 빈 후보 문자열을 다시 트리거
   * 그 이유는 빈 문자열을 remote peer에게 전달하여 모든 icecandidate 객체가 수집 되었음을 알리기 위해
   */
  // Setup ice handling
  peerConnection.onicecandidate = function(event) {
    if (event.candidate) {
      send({
        event : 'candidate',
        data : event.candidate
      });
    }
  };

  /**
   * 메시지 전달에 사용할 dataChannel
   */
  // creating data channel
  dataChannel = peerConnection.createDataChannel('dataChannel', {reliable : true});

  /**
   * 데이터 채널의 다양한 이벤트에 대한 리스너
   */
  dataChannel.onerror = (error) => {
    console.log('Error occured on datachannel:', error);
  };

  dataChannel.onclose = () => {
    console.log('data channel is closed');
  };

  /**
   * 다른 피어에서 메시지를 수신하기 위해 onmessage 이벤트에 대한 리스너를 생성
   */
  // when we receive a message from the other peer, printing it on the console
  dataChannel.onmessage = event => {
    console.log('message:', event.data);
  };

  /**
   * 데이터 채널에서 메시지를 수신하기위해 peerConnection 객체 에 콜백을 추가
   */
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
  };


  /**
   * WebRTC WebRTC peerconnection object에 스트림을 추가
   * peerconnection에 스트림을 추가하면 연결된 피어 에서 addstream 이벤트가 트리거
   */
  // peerConnection.addStream(stream);

  /**
   * remote peer 에서 listener를 통해 스트림을 수신
   * 해당 스트림은  HTML 비디오 요소로 설정
   */
  // peerConnection.onaddstream = function(event) {
  //     videoElement.srcObject = event.stream;
  // };

}

export const getSignalConn = () => {
  if(!conn) {
    conn = new WebSocket('wss://cauconnect.com/api/socket');
    initConn(conn)
  }
  return conn
}

function createOffer() {
  peerConnection.createOffer(function(offer) {
    //send 메소드는 오퍼 정보 를 전달하기 위해 Signaling Server를 호출
    send({
      event : "offer",
      data : offer
    });
    peerConnection.setLocalDescription(offer);
  }, function(error) {
    alert("Error creating an offer");
  });
}

/**
* offer를 받은 peer는 이를 remotedescription으로 설정하고
* answer를 생성하여 처음 peer 에게 보낸다.
*/
const handleOffer = (offer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  // create and send an answer to an offer
  peerConnection.createAnswer(function(answer) {
    peerConnection.setLocalDescription(answer);
    send({
      event : "answer",
      data : answer
    });
  }, function(error) {
    alert("Error creating an answer");
  });
};

/**
* 다른 peer가 보낸 ICE candidate를 처리해야 하는데
* 이 candidate를 받은 remote Peer는 해당 candidate를 candidate pool의 추가
*/
const handleCandidate = (candidate) => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

/**
* 처음 Peer는 anwser를 받고 setRemoteDescription 으로 설정
*/
const handleAnswer = (answer) => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("connection established successfully!!");
};

/**
* 연결 되었으므로 dataChannel 의 send 메서드를 사용하여 피어간에 메시지를 보낼 수 있다.
*/
export const sendMessage = (msg) => {
  dataChannel.send(msg);
}
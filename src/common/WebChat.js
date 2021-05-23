import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default class WebChat {
  isReady

  constructor(props) {
    const {roomId, userId} = props
    this.isReady = true
    this.roomId = roomId
    this.userId = userId
    this.count = 0

    const sock = new SockJS('https://cauconnect.com/api/chat')
    let ws = Stomp.over(sock)

    ws.connect({}, frame => {
      ws.subscribe(`/sub/chat/room/${roomId}`, msg => {
        const recv = JSON.parse(msg.body)
        this.recvMessage(recv)
      })
      this.isReady = true
    })
    this.conn = ws
  }

  sendMessage(msg){
    if(!this.isReady) return console.log('WebChat is not ready')

    const info = {
      type: 'TALK',
      chatroomId: this.roomId,
      userId: this.userId,
      message: msg,
    }

    this.conn.send('/pub/chat/message', {}, JSON.stringify(info))
  }

  recvMessage(msg){
    console.log(msg)
  }
}
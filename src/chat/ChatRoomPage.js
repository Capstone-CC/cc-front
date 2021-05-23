import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Layout from '../common/Layout'
import { apiGet } from '../utils/apiUtils'
import MessageBox from './MessageBox'
import TextInput from '../common/input/TextInput';
import './ChatRoomPage.css'
import WebChat from '../common/WebChat'
import { useDispatch } from 'react-redux'
import { pushToast } from '../common/commonAction'

const ChatRoomPage = props => {
  const [messageList, setMessageList] = useState([])
  const [myMessage, setMyMessage] = useState('')
  const list = useRef([])
  const history = useHistory()
  const chat = useRef(null)
  const {id} = useParams()

  const {myId, otherName, otherImageUrl} = history.location.state || {}
  
  useEffect(()=>{
    getChatContent()
    
    chat.current = new WebChat({roomId:id, userId:myId, onMessage})
  }, [])

  useEffect(() => {
    setMessageList([...list.current])
  }, [list.current])

  const getChatContent = async () => {
    try{
      const r = await apiGet(`/chatroom/list/${id}`)
      list.current = r
      setMessageList([...list.current])
    } catch(e){
      console.log(e)
    }
  }

  const onMessage = msg => {
    list.current.push(msg)
    setMessageList([...list.current])
  }

  const onMessageChange = e => {
    setMyMessage(e.target.value)
  }

  const onMessaageSubmit = e => {
    if(e.key === 'Enter') {
      setMyMessage('')
      chat.current.sendMessage(myMessage)
    }
  }

  return (
    <Layout hasNavigation={false} >
      <main className="chatting">
        {messageList.map(({userId, message}, i) => (
          <MessageBox key={`${i} ${message}`} isLeft={myId !== userId} name={otherName} message={message} imageUrl={otherImageUrl} />
        ))}
        <TextInput className="input" value={myMessage} onChange={onMessageChange} onKeyPress={onMessaageSubmit}/>
      </main>
    </Layout>
  )
}

export default ChatRoomPage
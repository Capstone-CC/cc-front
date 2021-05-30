import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import Layout from '../common/Layout'
import { apiGet } from '../utils/apiUtils'
import MessageBox from './MessageBox'
import TextInput from '../common/input/TextInput';
import './ChatRoomPage.css'
import WebChat from '../common/WebChat'

const ChatRoomPage = props => {
  const [messageList, setMessageList] = useState([])
  const [myMessage, setMyMessage] = useState('')
  const main = useRef(null)
  const list = useRef([])
  const history = useHistory()
  const chat = useRef(null)
  const {id} = useParams()

  const {myId, name, otherImageUrl, disabled} = history.location.state || {}
  
  useEffect(()=>{
    getChatContent()
    
    chat.current = new WebChat({roomId:id, userId:myId, onMessage})
  }, [])

  const getChatContent = async () => {
    try{
      const r = await apiGet(`/chatroom/list/${id}`)
      list.current = r
      setMessageList([...list.current])
      if(main.current) main.current.scrollTop = main?.current?.scrollHeight;
    } catch(e){
      console.log(e)
    }
  }

  const onMessage = msg => {
    list.current.push(msg)
    setMessageList([...list.current])
    console.log(main.current)
    if(main.current) main.current.scrollTop = main?.current?.scrollHeight;
  }

  const onMessageChange = e => {
    setMyMessage(e.target.value)
  }

  const onMessaageSubmit = e => {
    if(disabled) return ;
    if(e.key === 'Enter') {
      setMyMessage('')
      chat.current.sendMessage(myMessage)
    }
  }

  const onProfileClick = () => {
    history.push(`/chat/profile/${id}`)
  }

  return (
    <Layout hasNavigation={false} hasGnb title="채팅방">
      <main className="chatting" ref={main}>
        {messageList.map(({userId, message, type}, i) => (
          <MessageBox
            key={`${i} ${message}`}
            isLeft={myId !== userId}
            name={name}
            message={message}
            imageUrl={otherImageUrl}
            type={type}
            onProfileClick={onProfileClick}
          />
        ))}
        <TextInput className="input" value={myMessage} onChange={onMessageChange} onKeyPress={onMessaageSubmit} disabled={disabled}/>
      </main>
    </Layout>
  )
}

export default ChatRoomPage
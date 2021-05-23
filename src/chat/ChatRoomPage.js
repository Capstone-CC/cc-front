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
  const history = useHistory()
  const chat = useRef(null)
  const {id} = useParams()

  const {myId, imageUrl} = history.location.state

  const getChatContent = async () => {
    try{
      const r = await apiGet(`/chatroom/list/${id}`)
      setMessageList(r || [])
    } catch(e){
      console.log(e)
    }
  }
  
  useEffect(()=>{
    getChatContent()
    
    chat.current = new WebChat({roomId:id, userId:myId})
  }, [])

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
        {messageList.map(({id, senderId, sender:name, message}) => (
          <MessageBox key={id} isLeft={myId !== senderId} name={name} message={message} imageUrl={imageUrl} />
        ))}
        <TextInput className="input" value={myMessage} onChange={onMessageChange} onKeyPress={onMessaageSubmit}/>
      </main>
    </Layout>
  )
}

export default ChatRoomPage
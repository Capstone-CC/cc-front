import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  // const [maxPage, setMaxPage] = useState(1)
  const [page, setPage] = useState(0)
  const main = useRef(null)
  const list = useRef([])
  const history = useHistory()
  const chat = useRef(null)
  const {id} = useParams()

  const {myId, name, otherImageUrl, disabled} = history.location.state || {}

  const onScroll = useCallback(() => {
    if (main.current.scrollTop === 0) {
      
      setPage(prev => {
        getChatContent(prev + 1)
        return prev +1
      })
    }
  }, [page])
  
  useEffect(()=>{
    getChatContent(page)

    if(main.current) main.current.addEventListener('scroll', onScroll)
    
    chat.current = new WebChat({roomId:id, userId:myId, onMessage})
    return () => {
      chat.current.diconnect()
      if(main.current) main.current.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(()=>{

    if(main.current) main.current.addEventListener('scroll', onScroll)

    return () => {
      if(main.current) main.current.removeEventListener('scroll', onScroll)
    }
  }, [main.current])

  const getChatContent = async (page) => {
    try{
      const params = {
        page: page
      }
      const r = await apiGet(`/chatroom/list/${id}`, params)
      if(r.length === 0) return
      if(page === 1){
        list.current = r
        if(main.current) main.current.scrollTop = main?.current?.scrollHeight;
      }else{
        list.current = [...r, ...list.current]
      }
      setMessageList([...list.current])
      
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
    if(e.key === 'Enter' && myMessage.trim()) {
      setMyMessage('')
      chat.current.sendMessage(myMessage.trim())
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
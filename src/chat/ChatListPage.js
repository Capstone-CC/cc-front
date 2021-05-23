import React, { useEffect, useState } from 'react';

import Layout from '../common/Layout';
import { apiGet } from '../utils/apiUtils'
import ChatRoom from './ChatRoom';
import './ChatListPage.css'
import { useHistory } from 'react-router';

const ChatListPage = props => {
  const [chatList, setChatList] = useState([])
  const [meInfo, setMeInfo] = useState({})
  const history = useHistory()

  const getChatRoomList = async () => {
    const r = await apiGet('/chatroom/list')

    const info = {
      myId: r?.accountProfileApiResponse?.id
    }

    setChatList(r?.accountProfileApiResponse?.chatroomApiResponseList || [])
    setMeInfo(info)
  }

  useEffect(()=>{
    getChatRoomList()
  },[])

  const onChatRoomEnter = (id, otherImg) => e => {
    history.push(`/chat/${id}`, {...meInfo, imageUrl: otherImg})
  }

  return (
    <Layout>
      <main className="chat">
        {chatList.map(({id, name, otherImg}) => (
          <ChatRoom key={id} name={name} imageUrl={otherImg} onClick={onChatRoomEnter(id, otherImg)} />
        ))}
      </main>
    </Layout>
  );
};

export default ChatListPage

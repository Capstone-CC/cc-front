import React, { useEffect, useState } from 'react';

import Layout from '../common/Layout';
import { apiGet } from '../utils/apiUtils'
import ChatRoom from './ChatRoom';
import './ChatListPage.css'

const ChatListPage = props => {
  const [chatList, setChatList] = useState([])

  const getChatRoomList = async () => {
    const r = await apiGet('/chatroom/list')

    setChatList(r?.accountProfileApiResponse?.chatroomApiResponseList || [])
    console.log(r?.accountProfileApiResponse?.chatroomApiResponseList.length)
  }

  useEffect(()=>{
    getChatRoomList()
  },[])

  const onChatRoomEnter = id => e => {

  }

  return (
    <Layout>
      <main className="chat">
        {chatList.map(({id, name, otherImg}) => (
          <ChatRoom key={id} name={name} imageUrl={otherImg} onClick={onChatRoomEnter(id)} />
        ))}
      </main>
    </Layout>
  );
};

export default ChatListPage

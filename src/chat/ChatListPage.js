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
      myId: r?.accountProfileApiResponse?.id,
      otherName: r?.accountProfileApiResponse?.nickName
    }

    setChatList(r?.accountProfileApiResponse?.chatroomApiResponseList || [])
    setMeInfo(info)
  }

  useEffect(()=>{
    getChatRoomList()
  },[])

  const onChatRoomEnter = (id, otherImg) => e => {
    history.push(`/chat/${id}`, {...meInfo, otherImageUrl: otherImg, })
  }

  return (
    <Layout>
      <main className="chat">
        {chatList.map(({id, name, otherImg, lastMessage}) => (
          <ChatRoom key={id} name={name} imageUrl={otherImg} currentMessage={lastMessage} onClick={onChatRoomEnter(id, otherImg)} />
        ))}
        {chatList.length === 0 && (
          <div className="empty">
            - 채팅방이 없습니다 -
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ChatListPage

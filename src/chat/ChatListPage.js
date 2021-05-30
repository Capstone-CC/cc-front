import React, { useEffect, useState } from 'react';

import Layout from '../common/Layout';
import { apiGet } from '../utils/apiUtils'
import ChatRoom from './ChatRoom';
import './ChatListPage.css'
import { useHistory } from 'react-router';

const ChatListPage = props => {
  const [chatList, setChatList] = useState([])
  const [meInfo, setMeInfo] = useState({})
  const [doReload, setDoReload] = useState(true)
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
    if(doReload){
      getChatRoomList()
      setDoReload(false)
    }
  },[doReload])

  const onChatRoomEnter = (id, otherImg, disabled) => e => {
    history.push(`/chat/${id}`, {...meInfo, otherImageUrl: otherImg, disabled})
  }

  return (
    <Layout>
      <main className="chat">
        {chatList.map(({id, name, otherImg, lastMessage, manId, manStatus, womanId, womanStatus}) => (
          <ChatRoom
            key={id}
            id={id}
            name={name}
            imageUrl={otherImg}
            currentMessage={lastMessage}
            onClick={onChatRoomEnter(id, otherImg, manId == meInfo.myId ? womanStatus : manStatus)}
            onDelete={() => setDoReload(true)}
            disabled={manId == meInfo.myId ? womanStatus : manStatus}
          />
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

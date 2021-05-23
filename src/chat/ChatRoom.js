import React from 'react'

import Profile from '../images/profile-default.png';
import './ChatRoom.css'

const ChatRoom = props => {
  const {className, name, imageUrl, currentMessage, ...rest} = props

  return (
    <div {...rest} className={`chat-room ${className ? className : ''}`}>
      <div className="option-left">

      </div>
      <div className="left">
        <img src={imageUrl || Profile} alt="profile"/>
      </div>
      <div className="right">
        <div className="name">
          {name}
        </div>
        <div className="current">
          {currentMessage}
        </div>
      </div>
      <div className="option-right">

      </div>
      
    </div>
  )
}

export default ChatRoom
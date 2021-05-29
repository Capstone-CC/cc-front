import React from 'react'

import Profile from '../images/profile-default.png';
import './MessageBox.css'

const MessageBox = props => {
  const {isLeft, imageUrl, name, message, type, onProfileClick} = props

  return (
    <div className={`message-box ${isLeft ? 'left' : 'right'}`}>
      
      {type === 'LEAVE'
      ? (
        <div className="center">
          - {message} -
        </div>
      )
      : isLeft
        ? (<>
          <div className="left">
            <img src={imageUrl || Profile} alt="profile" onClick={onProfileClick}/>
          </div>
          <div className="right">
            <div className="name">{name}</div>
            <div className="message">{message}</div>
          </div>
        </>)
        : (<>
          <div className="message">{message}</div>
        </>)}
    </div>
  )
}

export default MessageBox
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { showLayer } from '../common/commonAction';

import Profile from '../images/profile-default.png';
import Trash from '../images/trash.png';
import { apiDelete } from '../utils/apiUtils';
import './ChatRoom.css'

const BUTTON_WIDTH = 100

const ChatRoom = props => {
  const {id, className, name, imageUrl, currentMessage, onDelete, disabled, ...rest} = props
  const dispatch = useDispatch()
  const isTriggered = useRef(false)
  const isDragging = useRef(false)
  const initX = useRef(0)
  const target = useRef(null)

  const onTouchStart = e => {
    target.current.addEventListener('touchmove', onTouchMove)
    target.current.addEventListener('touchend', onTouchEnd)

    isDragging.current = true
    
    const clientX = e.touches[0]?.clientX
    
    initX.current = clientX
  }

  const onTouchMove = e => {
    const clientX = e.touches[0]?.clientX

    const diff = clientX - initX.current
    
    if(target.current && diff < 0 && diff > -BUTTON_WIDTH) {
      target.current.style.transform = `translateX(${diff}px)`
    }

    if(BUTTON_WIDTH * 0.95 < -diff) {
      isTriggered.current = true
    }
  }

  const onTouchEnd = e => {
    isDragging.current = false

    requestAnimationFrame(moveBack)

    if(isTriggered.current) {
      dispatch(showLayer({ message:'상대방과 연결을 끊겠습니까?', onAgree:removeChatRoom }))
      isTriggered.current = false
    }

    target.current.removeEventListener('touchmove', onTouchMove)
    target.current.removeEventListener('touchend', onTouchEnd)
  }

  const moveBack = () => {
    if(!target.current) return

    const arr = target.current.style.transform.match(/translateX\((-\d+\.\d+)px\)/)
    const diff = arr?.length > 1 ? arr[1] : 0
    const newDiff = diff * 0.9

    if (!isDragging.current && newDiff < -1){
      target.current.style.transform = `translateX(${newDiff}px)`
      requestAnimationFrame(moveBack)
    } else{
      console.log('end')
      target.current.style.transform = `translateX(${0}px)`
      
    }
  }

  useEffect(()=> {
    target.current.addEventListener('touchstart', onTouchStart)

    return () => {
      if(target.current) target.current.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  const removeChatRoom = async () => {
    try{
      await apiDelete(`/chatroom/list/${id}`)
      onDelete()
    } catch(e){
      console.log(e)
    }
  }

  return (
    <div {...rest} className={`chat-room ${className ? className : ''} ${disabled ? 'disabled' : ''}`} ref={target} >
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
        <img className="trash" src={Trash} alt="icon" />
      </div>
      
    </div>
  )
}

export default ChatRoom
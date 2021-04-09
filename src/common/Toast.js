import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { popToast } from './commonAction'

import { toastListSelector } from './commonReduer'
import './Toast.css'

const Toast = props => {
  const [message, setMessage] = useState('')
  const [isOn, setIsOn] = useState(false)
  const dispatch = useDispatch()
  const timeout = useRef(null)
  const delay = useRef(null)

  const toastList = useSelector(toastListSelector)

  useEffect(()=>{
    if(!isOn && toastList.length > 0){
      dispatch(popToast())
      setMessage(toastList[0].message)
      setIsOn(true)

      timeout.current = setTimeout(()=>{
        setIsOn(false)
        timeout.current = null
      }, toastList[0].time)

    }

    if(isOn && toastList.length > 0){
      setIsOn(false)
      clearTimeout(timeout.current)
      clearTimeout(delay.current)

      delay.current = setTimeout(() => {
        dispatch(popToast())
        setMessage(toastList[0].message)
        setIsOn(true)

        timeout.current = setTimeout(()=>{
          setIsOn(false)
          timeout.current = null
        }, toastList[0].time)
      },200)
    }
  },[toastList])
  

  return (
    <div className="toast">
      <div className={`message ${isOn ? 'on' : ''}`}>{message ? message : ''}</div>
    </div>
  )
}

export default Toast
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'

import Icon from '../images/siren.png'
import { apiPost } from '../utils/apiUtils'
import { pushToast, showLayer } from './commonAction'

import './Siren.css'

const SIREN_STATE = {
  LEFT: '욕설및비하',
  CENTER: '성적발언',
  RIGHT: '협박성발언',
  NONE: ''
}

const SirenOption = props => {
  const {onChange = () => null} = props
  const [value, setValue] = useState(SIREN_STATE.NONE)

  useEffect(()=>{
    onChange(value)
  }, [onChange, value])

  const onClick = (v) => e => {
    setValue(v)
  }

  return (
    <div className="siren-box">
      <div className="message">신고하시겠습니까?</div>
      <div className="siren-select">
        <div className={`option ${value === SIREN_STATE.LEFT ? 'on' : ''}`} onClick={onClick(SIREN_STATE.LEFT)}>{SIREN_STATE.LEFT}</div>
        <div className={`option ${value === SIREN_STATE.CENTER ? 'on' : ''}`} onClick={onClick(SIREN_STATE.CENTER)}>{SIREN_STATE.CENTER}</div>
        <div className={`option ${value === SIREN_STATE.RIGHT ? 'on' : ''}`} onClick={onClick(SIREN_STATE.RIGHT)}>{SIREN_STATE.RIGHT}</div>
      </div>
    </div>
  )
}

const Siren = props => {
  const {rtc} = props
  const dispatch = useDispatch()
  const value = useRef(SIREN_STATE.NONE)
  const {id} = useParams()

  const onReport = async () => {
    // rtc
    if(rtc){
      rtc.report(value.current)
      return dispatch(pushToast("신고되었습니다."))
    }

    // rest
    try{
      const params = {
        id: id,
        contents: value.current,
      }
      const r = await apiPost('/report', params)
      dispatch(pushToast("신고되었습니다."))
    } catch(e){
      dispatch(pushToast(e))
    }
  }

  const onChange = (v) => {
    value.current = v
  }

  const onClick = () => {
    const option = {
      message: <SirenOption onChange={onChange} />,
      onAgree: onReport,
    }
    dispatch(showLayer(option))
  }

  return (
    <img className="siren" src={Icon} alt="icon" onClick={onClick}/>)
}

export default Siren
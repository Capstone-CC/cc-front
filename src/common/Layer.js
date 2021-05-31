import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideLayer } from './commonAction'
import { layerSelector } from './commonReduer'

import './Layer.css'

const Layer = props => {
  const dispatch = useDispatch()

  const {message, onCancel, onAgree, cancel, agree} = useSelector(layerSelector)

  const onCancelClick = () => {
    dispatch(hideLayer())
    onCancel()
  }

  const onAgreeClick = () =>{
    dispatch(hideLayer())
    onAgree()
  }

  return (!!message && (
    <div className="layer">
      <div className="box">
        <div className="message">{message}</div>
        <div className="interface">
          <div className="cancel" onClick={onCancelClick} >{cancel}</div>
          <div className="agree" onClick={onAgreeClick} >{agree}</div>
        </div>
      </div>
    </div>
  ))
}

export default Layer
import React, { useEffect, useState } from 'react'

import Thumb from '../../images/thumb.png';
import All from '../../images/all.png';
import './ThreeToggle.css'

export const TOGGLE_STATE = {
  LEFT: 2,
  CENTER: 0,
  RIGHT: 1
}

const classNameMap = {
  [TOGGLE_STATE.LEFT]: 'left',
  [TOGGLE_STATE.CENTER]: 'center',
  [TOGGLE_STATE.RIGHT]: 'right',
}

const ThreeToggle = props => {
  const {className, value, onChange= () => null, ...rest} = props

  const onToggleClick = e => {
    const x = e.nativeEvent.offsetX
    const width = e.nativeEvent.target.offsetWidth

    if(x < width/3){
      onChange(TOGGLE_STATE.LEFT)
    } else if(x >= width/3 && x < width*2/3 ){
      onChange(TOGGLE_STATE.CENTER)
    } else{
      onChange(TOGGLE_STATE.RIGHT)
    }
  }

  return (
    <div {...rest} className={`toggle ${className ? className : ''} ${classNameMap[value]}`} onClick={onToggleClick} >
      <img src={value === TOGGLE_STATE.CENTER ? All : Thumb} className="icon" alt="icon"/>
    </div>
  )
}

export default ThreeToggle
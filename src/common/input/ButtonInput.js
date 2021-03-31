import React from 'react'

import './ButtonInput.css'

const ButtonInput = props => {
  const {className, ...rest} = props

  return (
    <input type='button' className={`button ${className ? className : ''}`} {...rest}/>
  )
}

export default ButtonInput
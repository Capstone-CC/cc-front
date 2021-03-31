import React from 'react'

import './TextInput.css'

const TextInput = props => {
  const {className, ...rest} = props

  return (
    <input className={`text ${className ? className : ''}`} {...rest}/>
  )
}

export default TextInput
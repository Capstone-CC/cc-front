import React from 'react'

import './TextareaInput.css'

const TextareaInput = props => {
  const {className, ...rest} = props

  return (
    <textarea className={`textarea ${className ? className : ''}`} {...rest}/>
  )
}

export default TextareaInput
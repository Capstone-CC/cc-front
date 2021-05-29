import React from 'react'

import './EmailInput.css'

const EmailInput = props => {
  const {className, ...rest} = props

  return (
    <div className={`email ${className ? className : ''}`} >
      <input className="text" {...rest}/>
      <input className="domain" value="@cau.ac.kr"disabled/>
    </div>
  )
}

export default EmailInput
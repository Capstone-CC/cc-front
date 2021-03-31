import React from 'react'

import './SelectInput.css'

const SelectInput = props => {
  const {className, ...rest} = props

  return (
    <select className={`select ${className ? className : ''}`} {...rest} />
  )
}

export default SelectInput
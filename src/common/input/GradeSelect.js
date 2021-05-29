import React, { useState } from 'react'

import Grade from '../../images/grade.png';

const gradeList = [1, 2, 3, 4, 5, 6]

const GradeSelect = props => {
  const {className, value:grade, onChange, ...rest} = props
  const [isOpen, setIsOpen] = useState(false)

  const onToggle = e => {
    setIsOpen(!isOpen)
  }

  const onSelect = e => {
    if(isOpen){
      onChange(e)
    }
  }
 
  return (
    <div className={`grade-select ${className ? className : ''} ${isOpen ? 'open' : ''}`} onClick={onToggle} {...rest}>
      <img className="icon" src={Grade} />
      {gradeList.map(v => (
        <input key={v} className={`grade-option ${grade == v ? 'selected' : ''}`} value={v} onClick={onSelect} onChange={() => null} />
      ))}
    </div>
  )
}

export default GradeSelect
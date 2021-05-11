import React, { useState } from 'react'

const gradeList = [1, 2, 3, 4, 5, 6]

const GradeSelect = props => {
  const {className, value:grade = 1, onChange, ...rest} = props
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
      {gradeList.map(v => (
        <option key={v} className={`grade-option ${grade == v ? 'selected' : ''}`} value={v} onClick={onSelect}>
          {v}
        </option>
      ))}
      <option key={'all'} className={`grade-option ${grade == '' ? 'selected' : ''}`} value='' onClick={onSelect}>
        A
      </option>
    </div>
  )
}

export default GradeSelect
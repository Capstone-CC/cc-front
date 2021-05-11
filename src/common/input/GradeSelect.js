import React, { useState } from 'react'

const gradeList = [1, 2, 3, 4, 5, 6]

const GradeSelect = props => {
  const {className, onClick = () => null, ...rest} = props
  const [grade, setGrade] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  console.log('grade',grade)

  const onToggle = e => {
    setIsOpen(!isOpen)
    onClick(e)
  }

  const onSelect = e => {
    if(isOpen){

      setGrade(e.target?.value || 1)
    }
  }
 
  return (
    <div className={`grade-select ${className ? className : ''} ${isOpen ? 'open' : ''}`} onClick={onToggle} {...rest}>
      {gradeList.map(v => (
        <option key={v} className={`grade-option ${grade == v ? 'selected' : ''}`} value={v} onClick={onSelect}>
          {v}
        </option>
      ))}
    </div>
  )
}

export default GradeSelect
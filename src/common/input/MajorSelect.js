import React, { useEffect } from 'react'
import { apiGet } from '../../utils/apiUtils'
import SelectInput from './SelectInput'

const MajorSelect = props => {

  useEffect(()=>{
    const r = apiGet('/major/list');
    console.log(r)
  }, [])
 
  return (
    <SelectInput {...props} >
      <option value="" disabled >학과</option>
      <option value="1">컴퓨터공학과</option>
      <option value="2">간호학과</option>
      <option value="3">수학과</option>
      <option value="4">철학과</option>
      <option value="5">중어중문학과</option>
      <option value="6">연극영화과</option>
    </SelectInput>
  )
}

export default MajorSelect
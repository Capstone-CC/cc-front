import React, { useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiUtils'
import SelectInput from './SelectInput'

import './GradeSelect.css'

const MajorSelect = props => {
  const {onChange} = props
  const [majorList, setMajorList] = useState([])

  const getMajorList = async () => {
    try{
      const r = await apiGet('/major/list');
      setMajorList(r?.majorEnums || [])
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getMajorList()
  }, [])
 
  return (
    <SelectInput {...props} onChange={onChange} >
      <option value="" disabled >학과</option>
      {majorList.map(v => (
        <option key={v} value={v}>{v}</option>
      ))}
    </SelectInput>
  )
}

export default MajorSelect
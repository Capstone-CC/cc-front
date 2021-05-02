import React, { useEffect, useState } from 'react'
import { apiGet } from '../../utils/apiUtils'
import SelectInput from './SelectInput'

const MajorSelect = props => {
  const [majorList, setMajorList] = useState([])

  useEffect(()=>{
    const r = apiGet('/major/list');

    setMajorList(r?.majorEnums || [])
  }, [])
 
  return (
    <SelectInput {...props} >
      <option value="" disabled >학과</option>
      {majorList.map(v => (
        <option value={v}>{v}</option>
      ))}
    </SelectInput>
  )
}

export default MajorSelect
import React from 'react';
import {useHistory} from 'react-router-dom'

import Arrow from '../images/arrow.png';
import './Gnb.css'

const Gnb = props => {  
  const {hide, title, option} = props
  const history = useHistory()

  const onBack = () => {
    history.goBack()
  }

  return (
    <div className={`gnb ${hide ? 'hide' : ''}`}>
      <img src={Arrow} alt="back" className="icon" onClick={onBack}/>
      <div className="title">{title}</div>
      {!!option && <div className="option">{option}</div>}
    </div>
  );
};

export default Gnb
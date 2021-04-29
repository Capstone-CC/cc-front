import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import { getRTC } from '../utils/rtcUtils';
import {ReactComponent as Logo} from '../images/logo.svg';

const MainPage = props => {
  const [rtc, setRTC] = useState(null)

  useEffect(()=>{
    setRTC(getRTC())
  }, [])

  const onMatch = e => {
    console.log('click')
    rtc.offer()
  }

  return (
    <Layout>
      <main className="login">
        <Logo className="logo" onClick={onMatch}/>    
      </main>
    </Layout>
  );
};

export default MainPage

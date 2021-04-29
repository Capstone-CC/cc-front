import React, { useEffect } from 'react';
import Layout from '../common/Layout';
import { getSignalConn } from '../utils/rtcUtils';

const MainPage = props => {

  useEffect(()=>{
    const conn = getSignalConn()
    console.log(conn)
  }, [])

  return (
    <Layout>
      매칭
    </Layout>
  );
};

export default MainPage

import React, { useEffect, useRef, useState } from 'react';
import Circle from '../common/anime/Circle';

import Layout from '../common/Layout';
import WebRTC from '../common/WebRTC';
import {ReactComponent as Logo} from '../images/logo.svg';
import './MainPage.css'

export const PEER_SEARCHING = 'PEER_SEARCHING'
export const PEER_CONNECTED = 'PEER_CONNECTED'
export const PEER_DISCONNECTED = 'PEER_DISCONNECTED'

const MainPage = props => {
  const [rtc, setRTC] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const audio = useRef(null)

  window.rtc = rtc

  useEffect(()=>{
    setRTC(new WebRTC({
      audioElement:audio.current,
      onSearch: () => setIsSearching(true),
      onMiss: () => setIsSearching(false),
      onConnect: () => console.log('connect!'),
      onDisconnect: () => setIsSearching(false)
    }))
  }, [])

  const onSearch = e => {
    rtc.createOffer()
  }

  const onPlay = () => {
    audio.current.play()
  }

  return (
    <Layout>
      <main className="home">
        <Circle className="search" onClick={onSearch} disabled={!isSearching}/>
        {/* <Logo onClick={onPlay}/> */}
        <audio ref={audio} />
      </main>
    </Layout>
  );
};

export default MainPage

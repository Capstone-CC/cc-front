import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Circle, { CIRCLE_COLOR } from '../common/anime/Circle';
import ButtonInput from '../common/input/ButtonInput';
import { pushToast } from '../common/commonAction';
import Layout from '../common/Layout';
import WebRTC from '../common/WebRTC';
import './MainPage.css'
import MajorSelect from '../common/input/MajorSelect';
import GradeSelect from '../common/input/GradeSelect';
import { apiGet } from '../utils/apiUtils';
import { formatMMSS } from '../utils/dateUtils';

const MATCH_STATE = {
  DISCONNECT: 0,
  SEARCH: 1,
  CONNECT: 2,
  ACCEPT: 3,
}

const circleColorMap = {
  [MATCH_STATE.DISCONNECT]: CIRCLE_COLOR.BLACK,
  [MATCH_STATE.SEARCH]: CIRCLE_COLOR.YELLOW,
  [MATCH_STATE.CONNECT]: CIRCLE_COLOR.PINK,
  [MATCH_STATE.ACCEPT]: CIRCLE_COLOR.PINK,
}

const classNameMap = {
  [MATCH_STATE.DISCONNECT]: 'default',
  [MATCH_STATE.SEARCH]: 'search',
  [MATCH_STATE.CONNECT]: 'connect',
  [MATCH_STATE.ACCEPT]: 'accept',
}

const MainPage = props => {
  const [searchState, setSearchState] = useState(MATCH_STATE.DISCONNECT)
  const [grade, setGrade] = useState('')
  const [major, setMajor] = useState('')
  const [time, setTime] = useState(0)
  const dispatch = useDispatch()
  const rtc = useRef(null)
  const audio = useRef(null)

  window.rtc = rtc.current

  useEffect(() => {

    getUserInfo()

    rtc.current = new WebRTC({
      audioElement:audio.current,
      onSearch: () => {
        setSearchState(MATCH_STATE.SEARCH)
        dispatch(pushToast('매칭을 시작합니다.'))
      },
      onCancel: () => {
        setSearchState(MATCH_STATE.DISCONNECT)
        dispatch(pushToast('매칭을 종료합니다.'))
      },
      onMiss: () => {
        setSearchState(MATCH_STATE.DISCONNECT)
        dispatch(pushToast('매칭 상대를 찾지 못했습니다.'))
      },
      onConnect: () => {
        setSearchState(MATCH_STATE.CONNECT)
        dispatch(pushToast('상대방과 매칭되었습니다!'))
        audio.current.play()
      },
      onDisconnect: () => {
        setSearchState(MATCH_STATE.DISCONNECT)
        dispatch(pushToast('통화를 종료합니다.'))
      },
      onTick: t => {
        setTime(t)
        if(t <= 0){
          setSearchState(MATCH_STATE.DISCONNECT)
          dispatch(pushToast('통화 시간이 다되었습니다 ^^~'))
        }
      }
    })

    return () => {
      if(typeof rtc.current?.destruct === 'function') rtc.current.destruct()
    }

  }, [])

  const onSearch = e => {
    const option = {
      grade: grade || 0,
      majorName: major || 'ALL',
      majorState: 0
    }

    rtc.current.search(option)
  }


  const getUserInfo = async () => {
    try{
      const r = await apiGet('/profile')
      setGrade(r.grade || '')
      setMajor(r.majorName || '')
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    if(typeof rtc.current?.cancel === 'function') {
      rtc.current.sendSignal({
        event: 'cancel'
      })
      rtc.current.cancel()
    }
  }

  const onDisconnect = () => {
    if(typeof rtc.current?.disconnect === 'function') {
      rtc.current.sendSignal({
        event: 'disconnect'
      })
      rtc.current.disconnect()
    }
  }

  const onAccept = () => {
    rtc.current.sendSignal({
      event: 'accept'
    })
    setSearchState(MATCH_STATE.ACCEPT)
    dispatch(pushToast('호감표시 완료~'))
  }

  const onGradeSelect = e => {
    setGrade(e.target.value)
  }

  const onMajorSelect = e => {
    setMajor(e.target.value)
  }

  return (
    <Layout hideNavigation={searchState !== MATCH_STATE.DISCONNECT}>
      <main className={`home ${classNameMap[searchState]}`}>
        <GradeSelect className="grade" value={grade} onChange={onGradeSelect} />
        <Circle className="start" onClick={onSearch} color={circleColorMap[searchState]} />
        <MajorSelect className="major" value={major} onChange={onMajorSelect} />
        <div className="timer">{formatMMSS(time)}</div>
        <div className="interface">
          <ButtonInput className="cancel" value="매칭 취소" onClick={onCancel} />
          <ButtonInput className="disagree" value="통화 종료" onClick={onDisconnect} />
          <ButtonInput className="agree" value="수락 하기" onClick={onAccept}/>
          <ButtonInput className="disconnect" value="통화 종료" onClick={onDisconnect}/>
        </div>
        <audio ref={audio} />
      </main>
    </Layout>
  );
};

export default MainPage

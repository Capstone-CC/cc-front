import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonInput from '../common/input/ButtonInput';
import MajorSelect from '../common/input/MajorSelect';
import GradeSelect from '../common/input/GradeSelect';
import ThreeToggle from '../common/input/ThreeToggle';
import Circle, { CIRCLE_COLOR } from '../common/anime/Circle';
import { pushToast } from '../common/commonAction';
import Layout from '../common/Layout';
import WebRTC from '../common/WebRTC';
import { formatMMSS } from '../utils/dateUtils';
import { apiGet } from '../utils/apiUtils';

import Ticket from '../images/ticket.png';
import User from '../images/user.png';
import './MainPage.css'
import { setUserInfo } from './mainPageAction';
import { userInfoSelector } from './mainPageReducer';

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
  const [ticketCount, setTicketCount] = useState('-')
  const [userCount, setUserCount] = useState('-')
  const [time, setTime] = useState(0)
  const dispatch = useDispatch()
  const rtc = useRef(null)
  const audio = useRef(null)

  const {grade, gradeFlag, major, majorFlag} = useSelector(userInfoSelector)

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
      onCouple: (name) => {
        dispatch(pushToast(`${name}님과 채팅방이 개설되었습니다!!`))
      },
      onTick: t => {
        setTime(t)
        if(t <= 0){
          setSearchState(MATCH_STATE.DISCONNECT)
          dispatch(pushToast('통화 시간이 다되었습니다 ^^~'))
        }
      },
      onTicketCount: v => {
        setTicketCount(v)
      },
      onUserCount: v => {
        setUserCount(v)
      }
    })

    return () => {
      if(typeof rtc.current?.destruct === 'function') rtc.current.destruct()
    }

  }, [])

  const onSearch = e => {
    if(ticketCount <= 0){
      return dispatch(pushToast('매칭 티켓이 부족합니다.'))
    }
    const option = {
      grade: grade || 0,
      gradeState: gradeFlag,
      majorName: major || 'ALL',
      majorState: majorFlag
    }

    rtc.current.search(option)
  }

  const getUserInfo = async () => {
    try{
      const r = await apiGet('/profile')
      
      dispatch(setUserInfo({
        grade: grade || r.grade,
        major: major || r.majorName,
      }))
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    if(typeof rtc.current?.cancel === 'function') rtc.current.cancel()
  }

  const onDisconnect = () => {
    if(typeof rtc.current?.disconnect === 'function') rtc.current.disconnect()
  }

  const onAccept = () => {
    if(typeof rtc.current?.accept === 'function') rtc.current.accept()
    setSearchState(MATCH_STATE.ACCEPT)
    dispatch(pushToast('호감표시 완료~'))
  }

  const setValue = setter => e => setter(e.target.value)

  const dispatchValue = action => key => value => dispatch(action({[key]:value}))

  return (
    <Layout hideNavigation={searchState !== MATCH_STATE.DISCONNECT}>
      <main className={`home ${classNameMap[searchState]}`}>
        <div className="info">
          <div className="ticket" >
            <img className="icon" src={Ticket} />
            <div className="value">{ticketCount}</div>
          </div>
          <div className="user" >
            <img className="icon" src={User} />
            <div className="value">{userCount}</div>
          </div>
        </div>
        <Circle className="start" color={circleColorMap[searchState]} />
        
        <div className="grade-filter">
          <GradeSelect className="select" value={grade} onChange={setValue(dispatchValue(setUserInfo)('grade'))} />
          <ThreeToggle className="toggle" value={gradeFlag} onChange={dispatchValue(setUserInfo)('gradeFlag')}/>
        </div>
        <div className="major-filter">
          <MajorSelect className="select" value={major} onChange={setValue(dispatchValue(setUserInfo)('major'))} />
          <ThreeToggle className="toggle" value={majorFlag} onChange={dispatchValue(setUserInfo)('majorFlag')}/>
        </div>
        <div className="timer">{formatMMSS(time)}</div>
        <div className="interface">
          <ButtonInput className="search" value="~ 매칭 하기 ~" onClick={onSearch}/>
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

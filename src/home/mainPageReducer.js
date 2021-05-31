import { path } from 'ramda';
import { combineReducers } from 'redux';
import { TOGGLE_STATE } from '../common/input/ThreeToggle';

import { SET_RTC_INFO, SET_USER_INFO } from './mainPageAction';

const userInfoReducer = (state = {
  grade: '',
  gradeFlag: TOGGLE_STATE.CENTER,
  major: '',
  majorFlag: TOGGLE_STATE.CENTER,
}, action) => {
  const {type, payload} = action

  switch(type){
    case SET_USER_INFO:
      return {...state, ...payload}
    default:
      return state
  }
}

const rtcInfoReducer = (state = {}, action) => {
  const {type, payload} = action


  switch(type){
    case SET_RTC_INFO:
      return {...state, ...payload}
    default:
      return state
  }
}

export default combineReducers({
  userInfo: userInfoReducer,
  rtcInfo: rtcInfoReducer,
});

const createSelector = key => state => path(['mainPage',key], state)

export const userInfoSelector = createSelector('userInfo')
export const rtcInfoSelector = createSelector('rtcInfo')

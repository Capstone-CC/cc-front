export const SET_RTC_INFO = 'SET_RTC_INFO'
export const SET_USER_INFO = 'SET_USER_INFO'

export const setRtcInfo = (info) => ({
  type: SET_RTC_INFO,
  payload: {
    ...info
  }
})

export const setUserInfo = (info) => ({
  type: SET_USER_INFO,
  payload: {
    ...info
  }
})
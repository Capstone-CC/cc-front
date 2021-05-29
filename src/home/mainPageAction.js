export const SET_USER_INFO = 'SET_USER_INFO'

export const setUserInfo = (info) => ({
  type: SET_USER_INFO,
  payload: {
    ...info
  }
})
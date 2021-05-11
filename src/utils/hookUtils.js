import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { pushToast } from "../common/commonAction";

const AUTH_COOKIE_NAME = 'isLogin'

export const useAuth = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (document.cookie.indexOf(`${AUTH_COOKIE_NAME}=true`) === -1) {
      history.push('/login')
      dispatch(pushToast('로그인이 필요합니다.'))
    }
  },[dispatch, history]) 
}

export const logoutCookie = () => {
  document.cookie = document.cookie.replace(`${AUTH_COOKIE_NAME}=true`,`${AUTH_COOKIE_NAME}=false`)
}

export const loginCookie = () => {
  if(document.cookie.indexOf(`${AUTH_COOKIE_NAME}=true`) === -1){
    document.cookie += `${AUTH_COOKIE_NAME}=true;`
  }
}
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { pushToast } from "../common/commonAction";

export const useAuth = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    let cookieName = 'login'
    document.cookie = cookieName + "=true;path=/;";
    if (document.cookie.indexOf(cookieName + '=') === -1) {
      history.push('/login')
      dispatch(pushToast('로그인이 필요합니다.'))
    }
  },[history]) 
}
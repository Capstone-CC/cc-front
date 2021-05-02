import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { pushToast } from "../common/commonAction";

export const useAuth = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (document.cookie.indexOf('login=true') === -1) {
      history.push('/login')
      dispatch(pushToast('로그인이 필요합니다.'))
    }
  },[dispatch, history]) 
}
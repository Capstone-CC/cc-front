import { useEffect } from "react";
import { useHistory } from "react-router";

export const useAuth = () => {
  const history = useHistory()

  useEffect(() => {
    let cookieName = 'isLogin'
    let d = new Date();
    d.setTime(d.getTime() + (1000));
    let expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=true;path=/;" + expires;

    if (document.cookie.indexOf(cookieName + '=') !== -1) {
      history.push('/login')
    }
  },[history]) 
}
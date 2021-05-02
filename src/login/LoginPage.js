import React, { useEffect, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';

import {ReactComponent as Logo} from '../images/logo.svg';
import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import './LoginPage.css'
import ButtonInput from '../common/input/ButtonInput';
import { apiPost } from '../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { pushToast } from '../common/commonAction';

const LoginPage = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(()=>{
    onLogout()
  }, [])

  const onLogout = async () => {
    try{
      await apiPost('/logout')
      console.log('로그아웃 성공')
    } catch(e) {
      console.log('로그아웃 실패')
    }
  }

  const setValue = setter => e => setter(e.target.value)

  const onLogin = async () => {
    try{
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
        password
      }
      await apiPost('/login', params)
      history.push('/home')
    } catch (e){
      dispatch(pushToast(e || '이메일 / 비밀번호를 확인해주세요'))
    }
  }

  const onTest = () => {
    dispatch(pushToast("비밀번호 찾기 기능은 개발중입니다."))
  }

  const onPreventDefault = e => {
    e.preventDefault()
  }

  return (
    <Layout hasNavigation={false}>
      <main className="login">
        <Logo className="logo" />
        <form onSubmit={onPreventDefault}>
          <TextInput className="email" placeholder="email@cau.ac.kr" onChange={setValue(setEmail)} />
          <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPassword)} />
          <ButtonInput className="submit" type="submit" value="로그인" onClick={onLogin} onSubmit={onLogin}/>
        </form>
        <div className="help">
          <Link className="password" to="/login" onClick={onTest}>비밀번호찾기</Link>
          <div className="dividor">/</div>
          <Link className="register" to="/register">회원가입</Link>
        </div>
      </main>
    </Layout>
  );
};

export default LoginPage

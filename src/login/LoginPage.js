import React, { useState } from 'react';
import {Link} from 'react-router-dom';

import {ReactComponent as Logo} from '../images/logo.svg';
import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import './LoginPage.css'
import ButtonInput from '../common/input/ButtonInput';
import { apiPost } from '../utils/apiUtils';

const LoginPage = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const setValue = setter => e => setter(e.target.value)

  const onLogin = () => {
    const r = apiPost('/login',{email,password})
  }

  return (
    <Layout hasNavigation={false}>
      <main className="login">
        <Logo className="logo" />
        <TextInput className="email" placeholder="email@cau.ac.kr" onChange={setValue(setEmail)} />
        <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPassword)} />
        <ButtonInput className="submit" value="로그인" onClick={onLogin} />
        <div className="help">
          <Link className="password">비밀번호찾기</Link>
          <div className="dividor">/</div>
          <Link className="register" to="/register">회원가입</Link>
        </div>
      </main>
    </Layout>
  );
};

export default LoginPage

import React from 'react';
import {Link} from 'react-router-dom';

import {ReactComponent as Logo} from '../images/logo.svg';
import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import './LoginPage.css'
import ButtonInput from '../common/input/ButtonInput';

const LoginPage = props => {

  return (
    <Layout hasNavigation={false}>
      <main className="login">
        <Logo className="logo" />
        <TextInput className="email" placeholder="email@cau.ac.kr" />
        <TextInput className="password" type="password" placeholder="***************" />
        <ButtonInput className="submit" value="로그인" />
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

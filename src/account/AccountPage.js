import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { showLayer } from '../common/commonAction';

import Layout from '../common/Layout';
import './AccountPage.css'

const AccountPage = props => {
  const dispatch = useDispatch()
  const history = useHistory()

  const onLogout = () => {
    const option = {
      message: '로그아웃 하시겠습니까?',
      onAgree: () => {
        history.push('/login')
      }
    }

    dispatch(showLayer(option))
  }
  
  return (
    <Layout>
      <main className="account">
        <Link to="/account/profile" className="profile">
          내 프로필
        </Link>
        <Link to="/account/password" className="password">
          비밀번호 변경
        </Link>
        <Link to="/account/agreement" className="agreement">
          개인정보 처리방침
        </Link>
        <div className="logout" onClick={onLogout}>
          로그아웃
        </div>
      </main>
    </Layout>
  );
};

export default AccountPage

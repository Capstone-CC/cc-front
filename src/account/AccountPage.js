import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../common/Layout';
import './AccountPage.css'

const AccountPage = props => {
  
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
          개인정보 취급 동의
        </Link>
        <Link to="/login" className="logout">
          로그아웃
        </Link>
      </main>
    </Layout>
  );
};

export default AccountPage

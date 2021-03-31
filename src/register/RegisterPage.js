import React from 'react';

import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import './RegisterPage.css'
import ButtonInput from '../common/input/ButtonInput';
import SelectInput from '../common/input/SelectInput';

const RegisterPage = props => {

  return (
    <Layout hasNavigation={false}>
      <main className="register">
        <div className="email">
          <TextInput className="input" placeholder="email@cau.ac.kr" />
          <ButtonInput className="send" value="요청"/>
        </div>
        <div className="auth">
          <TextInput className="input" placeholder="인증번호" />
          <ButtonInput className="send" value="확인"/>
        </div>
        <TextInput className="password" type="password" placeholder="***************" />
        <TextInput className="password" type="password" placeholder="***************" />
        <div className="info">
          <SelectInput className="gender" >
            <option value="" disabled selected>성별</option>
            <option value="M">남자</option>
            <option value="W">여자</option>
          </SelectInput>
          <SelectInput className="grade">
            <option value="" disabled selected>학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년</option>
            <option value="6">6학년</option>
          </SelectInput>
        </div>
        {/* TODO: 서버로 부터 받아야함  */}
        <SelectInput className="major">
            <option value="" disabled selected>학과</option>
            <option value="1">컴퓨터공학과</option>
            <option value="2">간호학과</option>
            <option value="3">수학과</option>
            <option value="4">철학과</option>
            <option value="5">중어중문학과</option>
            <option value="6">연극영화과</option>
          </SelectInput>
        <ButtonInput className="submit" value="가입하기" />
      </main>
    </Layout>
  );
};

export default RegisterPage

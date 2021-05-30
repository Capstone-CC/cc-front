import React, { useState } from 'react';

import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import './RegisterPage.css'
import ButtonInput from '../common/input/ButtonInput';
import SelectInput from '../common/input/SelectInput';
import { apiGet, apiPost } from '../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { pushToast } from '../common/commonAction';
import { useHistory } from 'react-router';
import MajorSelect from '../common/input/MajorSelect';
import { loginCookie } from '../utils/hookUtils';
import EmailInput from '../common/input/EmailInput';

const RegisterPage = props => {
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [gender, setGender] = useState('')
  const [grade, setGrade] = useState('')
  const [major, setMajor] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const setValue = setter => e => setter(e.target.value)

  const onRequest = async () => {
    try{
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
      }
      await apiGet('/email', params)
      dispatch(pushToast('인증번호를 요청했습니다.'))
    } catch (e) {
      dispatch(pushToast(e || '인증번호 요청에 실패했습니다.'))
    }
  }

  const onVerify = async () => {
    try {
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
        code
      }
      await apiGet('/verify', params)
      setIsVerified(true)
      dispatch(pushToast('인증 성공했습니다.'))
    } catch (e) {
      dispatch(pushToast(e || '인증 실패했습니다.'))
    }
  }

  const onRegister = async () => {
    try{
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
        password,
        confirmPw:passwordConfirm,
        gender,
        grade,
        majorName:major,
      }
  
      await apiPost('/register', params)
      loginCookie()
      history.push('/home')
    } catch(e) {
      dispatch(pushToast(e || '회원가입에 실패했습니다'))
    }
  }

  return (
    <Layout hasNavigation={false} hasGnb title="회원가입">
      <main className="register">
        <div className="email">
          <EmailInput className="input" value={email} placeholder="email" onChange={setValue(setEmail)} disabled={isVerified} />
          <ButtonInput className="send" value="요청" onClick={onRequest} disabled={isVerified} />
        </div>
        <div className="auth">
          <TextInput className="input" placeholder="인증번호" onChange={setValue(setCode)} disabled={isVerified} />
          <ButtonInput className="send" value="확인" onClick={onVerify} disabled={isVerified} />
        </div>
        <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPassword)}/>
        <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPasswordConfirm)}/>
        <div className="info">
          <SelectInput className="gender" value={gender} onChange={setValue(setGender)}>
            <option value="" disabled >성별</option>
            <option value="남">남자</option>
            <option value="여">여자</option>
          </SelectInput>
          <SelectInput className="grade" value={grade} onChange={setValue(setGrade)}>
            <option value="" disabled >학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
            <option value="5">5학년</option>
            <option value="6">6학년</option>
          </SelectInput>
        </div>
        {/* TODO: 서버로 부터 받아야함  */}
        <MajorSelect className="major" value={major} onChange={setValue(setMajor)} />
        <ButtonInput className="submit" value="가입하기" onClick={onRegister}/>
      </main>
    </Layout>
  );
};

export default RegisterPage

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

const RegisterPage = props => {
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
      await apiGet('/email',{email})
      dispatch(pushToast('인증번호를 전송했습니다.'))
    } catch (e) {
      dispatch(pushToast(e))
    }
  }

  const onVerify = async () => {
    try {
      const r = await apiGet('/verify',{email,code})
      console.log(r?.data?.result)
      if(r?.data?.result){
        dispatch(pushToast('인증 되었습니다.'))
      } else {
        dispatch(pushToast('인증번호가 맞지 않습니다.'))
      }
    } catch (e) {
      dispatch(pushToast(e))
    }
  }

  const onRegister = async () => {
    const params = {
      email,
      password,
      confirmPw:passwordConfirm,
      gender,
      grade,
      majorName:major,
    }

    const r = await apiPost('/register', params)
    if(r?.data?.result){
      history.push('/home')
    } else {
      dispatch(pushToast('회원가입에 실패했습니다'))
    }
  }

  return (
    <Layout hasNavigation={false}>
      <main className="register">
        <div className="email">
          <TextInput className="input" placeholder="email@cau.ac.kr" onChange={setValue(setEmail)} />
          <ButtonInput className="send" value="요청" onClick={onRequest} />
        </div>
        <div className="auth">
          <TextInput className="input" placeholder="인증번호" onChange={setValue(setCode)} />
          <ButtonInput className="send" value="확인" onClick={onVerify} />
        </div>
        <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPassword)}/>
        <TextInput className="password" type="password" placeholder="***************" onChange={setValue(setPasswordConfirm)}/>
        <div className="info">
          <SelectInput className="gender" value="" onChange={setValue(setGender)}>
            <option value="" disabled >성별</option>
            <option value="M">남자</option>
            <option value="W">여자</option>
          </SelectInput>
          <SelectInput className="grade" value="" onChange={setValue(setGrade)}>
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
        <SelectInput className="major" value="" onChange={setValue(setMajor)}>
            <option value="" disabled >학과</option>
            <option value="1">컴퓨터공학과</option>
            <option value="2">간호학과</option>
            <option value="3">수학과</option>
            <option value="4">철학과</option>
            <option value="5">중어중문학과</option>
            <option value="6">연극영화과</option>
          </SelectInput>
        <ButtonInput className="submit" value="가입하기" onClick={onRegister}/>
      </main>
    </Layout>
  );
};

export default RegisterPage

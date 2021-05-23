import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { pushToast } from '../common/commonAction';
import ButtonInput from '../common/input/ButtonInput';
import TextInput from '../common/input/TextInput';

import Layout from '../common/Layout';
import { apiGet, apiPut } from '../utils/apiUtils';
import './PasswordFind.css'


const PasswordFind = props => {
  const [email, setEmail] = useState('')
  const [passwordTemp, setPasswordTemp] = useState('')
  const [passwordNew, setPasswordNew] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  const setValue = setter => e => setter(e.target.value)

  const onRequest = async () => {
    if(!email) return dispatch(pushToast('이메일을 입력해 주세요.'))

    try{
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
      }
      await apiGet('/account/password/find', params)
      dispatch(pushToast('임시 비밀번호를 전송했습니다.'))
    } catch(e) {
      dispatch(pushToast(e))
    }
  }

  const onVerify = async () => {
    if(!passwordTemp) return dispatch(pushToast('임시 비밀번호를 입력해 주세요.'))

    try{
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
        temporaryPw: passwordTemp,
      }
      await apiGet('/account/password/verify', params)
      setIsVerified(true)
      dispatch(pushToast('인증 되었습니다'))
    } catch(e){
      dispatch(pushToast(e))
    }
  }

  const onBack = () => {
    history.goBack()
  }

  const onModify = async () => {
    if(!isVerified) return dispatch(pushToast('임시 비밀번호를 인증해주세요.'))
    if(!passwordNew || !passwordConfirm) return dispatch(pushToast('새로운 비밀번호를 입력해주세요.'))
    if(passwordNew !== passwordConfirm) return dispatch(pushToast('비밀번호가 일치하지 않습니다.'))

    try {
      const params = {
        email: email?.replace(/@cau.ac.kr$/,'') || '',
        changePw: passwordNew,
        confirmPw: passwordConfirm,
        temporaryPw: passwordTemp
      }
      await apiPut('/account/password/modify', params)
      dispatch(pushToast('비밀번호가 변경되었습니다.'))
      history.push('/login')
    } catch(e) {
      dispatch(pushToast(e))
    }
  }

  return (
    <Layout hasNavigation={false}>
      <main className="password">
      <div className="email">
          <TextInput className="input" value={email} placeholder="email@cau.ac.kr" onChange={setValue(setEmail)} disabled={isVerified} autocomplete={false} />
          <ButtonInput className="send" value="요청" onClick={onRequest} disabled={isVerified} />
        </div>
        <div className="auth">
          <TextInput className="input" value={passwordTemp} placeholder="임시 비밀번호" onChange={setValue(setPasswordTemp)} disabled={isVerified} autocomplete={false} />
          <ButtonInput className="verify" value="확인" onClick={onVerify} disabled={isVerified} />
        </div>
        <TextInput className="password-new" type="password" placeholder="새 비밀번호" value={passwordNew} onChange={setValue(setPasswordNew)} autocomplete={false} />
        <TextInput className="password-confirm" type="password" placeholder="새 비밀번호 확인" value={passwordConfirm} onChange={setValue(setPasswordConfirm)} autocomplete={false} />
        <div className="interface">
          <ButtonInput className="back" value="뒤로가기" onClick={onBack} />
          <ButtonInput className="modify" value="변경하기" onClick={onModify} />
        </div>
      </main>
    </Layout>
  )
}

export default PasswordFind
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { pushToast } from '../../common/commonAction';
import ButtonInput from '../../common/input/ButtonInput';
import EmailInput from '../../common/input/EmailInput';
import TextInput from '../../common/input/TextInput';

import Layout from '../../common/Layout';
import { apiGet, apiPut } from '../../utils/apiUtils';
import './PasswordChange.css'


const PasswordChange = props => {
  const [password, setPassword] = useState('')
  const [passwordNew, setPasswordNew] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  const setValue = setter => e => setter(e.target.value)

  const onModify = async () => {
    if(!password) return dispatch(pushToast('기존 비밀번호를 입력해주세요.'))
    if(!passwordNew || !passwordConfirm) return dispatch(pushToast('새로운 비밀번호를 입력해주세요.'))
    if(passwordNew !== passwordConfirm) return dispatch(pushToast('새로운 비밀번호가 일치하지 않습니다.'))

    try {
      const params = {
        originPw: password,
        password: passwordNew,
        confirmPw: passwordConfirm,
      }
      await apiPut('/account/password', params)
      dispatch(pushToast('비밀번호가 변경되었습니다.'))
      history.goBack()
    } catch(e) {
      dispatch(pushToast(e))
    }
  }

  return (
    <Layout hasGnb title="비밀번호 변경">
      <main className="password">
        <form onSubmit={e => e.preventDefault()}>
          <TextInput className="password" type="password" placeholder="기존 비밀번호" value={password} onChange={setValue(setPassword)} autoComplete={undefined} />
          <TextInput className="password-new" type="password" placeholder="새 비밀번호" value={passwordNew} onChange={setValue(setPasswordNew)} autoComplete={undefined} />
          <TextInput className="password-confirm" type="password" placeholder="새 비밀번호 확인" value={passwordConfirm} onChange={setValue(setPasswordConfirm)} autoComplete={undefined} />
          <div className="interface">
            <ButtonInput type="submit" className="modify" value="변경하기" onClick={onModify} onSubmit={e=>console.log(e)} />  
          </div>
        </form>
      </main>
    </Layout>
  )
}

export default PasswordChange
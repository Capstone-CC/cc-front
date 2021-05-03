import React, { useEffect, useState } from 'react';

import ButtonInput from '../common/input/ButtonInput';
import SelectInput from '../common/input/SelectInput';
import TextareaInput from '../common/input/TextareaInput';
import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import ProfileDefault from '../images/profile-default.png';
import './MyProfilePage.css'
import { apiGet, apiPut } from '../utils/apiUtils';
import { useDispatch } from 'react-redux';
import { pushToast } from '../common/commonAction';
import MajorSelect from '../common/input/MajorSelect';

const MyProfilePage = props => {
  const [image, setImage] = useState(ProfileDefault)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [grade, setGrade] = useState('')
  const [major, setMajor] = useState('')
  const [description, setDescription] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()

  const getUserInfo = async () => {
    try{
      const r = await apiGet('/profile')
      setEmail(r.email)
      setNickname(r.nickName)
      setGender(r.gender)
      setGrade(r.grade)
      setMajor(r.majorName)
      setDescription(r.content)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getUserInfo()
  }, [])

  const onEdit = e => {
    setIsEdit(true)
  }

  const onConfirm = async e => {
    try{
      const params = {
        email:email,
        nickName:nickname,
        gender:gender,
        grade:grade,
        majorName:major,
        content:description,
      }
      await apiPut('/profile', params)
      setIsEdit(false)
      dispatch(pushToast('수정되었습니다.'))
    } catch(e) {
      dispatch(pushToast(e || '수정 실패했습니다.'))
    }
    
  }

  const setValue = setter => e => setter(e.target.value)
  const onPreventDefault = e => e.preventDefault()

  return (
    <Layout>
      <main className="profile">
        <div className="top">
          <img src={ProfileDefault} alt="profile" className="image" />
          <div className="non-image">
            <TextInput className="email" placeholder="email@cau.ac.kr" value={email + '@cau.ac.kr'} disabled />
            <TextInput className="nickname" placeholder="닉네임" value={nickname} onChange={setValue(setNickname)} disabled={!isEdit} />
          </div>
        </div>
        <form className="bottom" onSubmit={onPreventDefault}>
          <div className="info">
            <SelectInput className="gender" value={gender} onChange={setValue(setGender)} disabled={!isEdit} >
              <option value="" disabled >성별</option>
              <option value="남">남자</option>
              <option value="여">여자</option>
            </SelectInput>
            <SelectInput className="grade" value={grade} onChange={setValue(setGrade)} disabled={!isEdit} >
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
          <MajorSelect className="major" value={major} onChange={setValue(setMajor)} disabled={!isEdit} />
          <TextareaInput className="description" placeholder="자기소개" value={description} onChange={setValue(setDescription)} disabled={!isEdit} />
          {isEdit
            ? <ButtonInput className="submit confirm" type="submit" value="저장하기" onClick={onConfirm} />
            : <ButtonInput className="submit edit" type="submit" value="수정하기" onClick={onEdit} />
          }
        </form>
      </main>
    </Layout>
  );
};

export default MyProfilePage

import React, { useState } from 'react';

import ButtonInput from '../common/input/ButtonInput';
import SelectInput from '../common/input/SelectInput';
import TextareaInput from '../common/input/TextareaInput';
import TextInput from '../common/input/TextInput';
import Layout from '../common/Layout';
import ProfileDefault from '../images/profile-default.png';
import './MyProfilePage.css'

const MyProfilePage = props => {
  const [image, setImage] = useState(ProfileDefault)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [grade, setGrade] = useState('')
  const [major, setMajor] = useState('')
  const [description, setDescription] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  const onEdit = e => {
    setIsEdit(true)
  }

  const onConfirm = e => {
    setIsEdit(false)
  }

  const setValue = setter => e => setter(e.target.value)
  const onPreventDefault = e => e.preventDefault()

  return (
    <Layout>
      <main className="profile">
        <div className="top">
          <img src={ProfileDefault} alt="profile" className="image" />
          <div className="non-image">
            <TextInput className="email" placeholder="email@cau.ac.kr" value={email} onChange={setValue(setEmail)} disabled />
            <TextInput className="nickname" placeholder="닉네임" value={nickname} onChange={setValue(setNickname)} disabled={!isEdit} />
          </div>
        </div>
        <form className="bottom" onSubmit={onPreventDefault}>
          <div className="info">
            <SelectInput className="gender" value={gender} onChange={setValue(setGender)} disabled={!isEdit} >
              <option value="" disabled >성별</option>
              <option value="M">남자</option>
              <option value="W">여자</option>
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
          <SelectInput className="major" value={major} onChange={setValue(setMajor)} disabled={!isEdit} >
            <option value="" disabled >학과</option>
            <option value="1">컴퓨터공학과</option>
            <option value="2">간호학과</option>
            <option value="3">수학과</option>
            <option value="4">철학과</option>
            <option value="5">중어중문학과</option>
            <option value="6">연극영화과</option>
          </SelectInput>
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

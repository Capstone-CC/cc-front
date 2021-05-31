import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import SelectInput from '../../common/input/SelectInput';
import TextareaInput from '../../common/input/TextareaInput';
import TextInput from '../../common/input/TextInput';
import Layout from '../../common/Layout';
import Profile from '../../images/profile-default.png';
import './OtherProfilePage.css'
import { apiGet } from '../../utils/apiUtils';
import Siren from '../../common/Siren';

const OtherProfilePage = props => {
  const [imageUrl, setImageUrl] = useState(Profile)
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [grade, setGrade] = useState('')
  const [description, setDescription] = useState('')
  const {id} = useParams()

  const getUserInfo = async () => {
    try{
      const r = await apiGet(`/chatroom/list/${id}/other`)
      setImageUrl(r.image || '')
      setNickname(r.nickName || '')
      setGender(r.gender || '')
      setGrade(r.grade || '')
      setDescription(r.content || '')
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    getUserInfo()
  }, [])

  const noop = () => null

  return (
    <Layout hasGnb title="상대 프로필" option={<Siren />}>
      <main className="profile">
        <div className="top">
          <div className="image">
            <input className="upload" type="file" name="name" onChange={noop} />
            <img src={imageUrl || Profile} alt="profile"/>
          </div>
          <div className="non-image">
            <TextInput className="email" placeholder="email@cau.ac.kr" value={'-'} onChange={noop} disabled={true} />
            <TextInput className="nickname" placeholder="닉네임" value={nickname} onChange={noop} disabled={true} />
          </div>
        </div>
        <div className="bottom">
          <div className="info">
            <SelectInput className="gender" value={gender} onChange={noop} disabled={true} >
              <option value="" disabled >성별</option>
              <option value="남">남자</option>
              <option value="여">여자</option>
            </SelectInput>
            <SelectInput className="grade" value={grade} onChange={noop} disabled={true} >
              <option value="" disabled >학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
              <option value="5">5학년</option>
              <option value="6">6학년</option>
            </SelectInput>
          </div>
          <TextareaInput className="description" placeholder="자기소개" value={description} onChange={noop} disabled={true} />
        </div>
      </main>
    </Layout>
  );
};

export default OtherProfilePage

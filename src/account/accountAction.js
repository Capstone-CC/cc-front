export const SET_MY_PROFILE = 'SET_MY_PROFILE'

export const setMyProfile = ({imageUrl='', email='', nickname='', gender='', grade='', major='', description=''}) => ({
  type: SET_MY_PROFILE,
  payload: {
    imageUrl,
    email,
    nickname,
    gender,
    grade,
    major,
    description,
  }
})
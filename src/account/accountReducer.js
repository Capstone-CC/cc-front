import { path } from 'ramda';
import { combineReducers } from 'redux';

import { SET_MY_PROFILE } from './accountAction';

const myProfileReducer = (state = {}, action) => {
  const {type, payload} = action

  switch(type){
    case SET_MY_PROFILE:
      return {...payload}
    default:
      return state
  }
}

export default combineReducers({
  myProfile: myProfileReducer,
});

const createSelector = key => state => path(['account',key],state)

export const myProfileSelector = createSelector('myProfile')
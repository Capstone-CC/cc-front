import { path } from 'ramda';
import { combineReducers } from 'redux';
import { POP_TOAST, PUSH_TOAST } from './commonAction';

const toastListReducer = (state = [], action) => {
  const {type} = action

  switch(type){
    case PUSH_TOAST:
      return [...state, action.payload]
    case POP_TOAST:
      return [...state].slice(1)
    default:
      return state
  }
}

export default combineReducers({
  toastList: toastListReducer,
});

const createSelector = key => state => path(['common',key],state)

export const toastListSelector = createSelector('toastList')

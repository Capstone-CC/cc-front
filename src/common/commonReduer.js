import { path } from 'ramda';
import { combineReducers } from 'redux';
import { HIDE_LAYER, POP_TOAST, PUSH_TOAST, SHOW_LAYER } from './commonAction';

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

const layerReducer = (state = {}, action) => {
  const {type, payload} = action

  switch(type){
    case SHOW_LAYER:
      return {
        ...payload
      }
    case HIDE_LAYER:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  toastList: toastListReducer,
  layer: layerReducer,
});

const createSelector = key => state => path(['common',key],state)

export const toastListSelector = createSelector('toastList')
export const layerSelector = createSelector('layer')

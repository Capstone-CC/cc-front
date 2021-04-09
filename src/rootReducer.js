import { combineReducers } from 'redux';

import commonReducer from './common/commonReduer'

export default combineReducers({
  common: commonReducer,
});

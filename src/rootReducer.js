import { combineReducers } from 'redux';

import commonReducer from './common/commonReduer'
import mainPageReducer from './home/mainPageReducer';

export default combineReducers({
  common: commonReducer,
  mainPage: mainPageReducer,
});

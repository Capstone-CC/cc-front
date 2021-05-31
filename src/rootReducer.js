import { combineReducers } from 'redux';

import commonReducer from './common/commonReduer'
import mainPageReducer from './home/mainPageReducer';
import accountReducer from './account/accountReducer';

export default combineReducers({
  common: commonReducer,
  mainPage: mainPageReducer,
  account: accountReducer,
});

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authReducer';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['isLoggedIn', 'token'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export default rootReducer;
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './userState';
import isMode from './modeState';

export default configureStore({
  reducer:{
    authSlice : authSlice.reducer,
    isMode : isMode.reducer,
  }
})
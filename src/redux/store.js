import { configureStore } from '@reduxjs/toolkit';
import authSlice from './userState';
import isMode from './modeState';
import location from './locationState';

export default configureStore({
  reducer:{
    authSlice : authSlice.reducer,
    isMode : isMode.reducer,
    location : location.reducer,
  }
})
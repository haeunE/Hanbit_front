import { configureStore } from '@reduxjs/toolkit';
import authSlice from './userState';

export default configureStore({
  reducer:{
    authSlice : authSlice.reducer,
  }
})
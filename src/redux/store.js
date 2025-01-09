import { configureStore } from '@reduxjs/toolkit';
import authSlice from './userState';
import languageSlice from './languageState';
import modeSlice from './modeState';
import locationSlice from './locationState';

export default configureStore({
  reducer:{
    auth : authSlice.reducer,
    isMode : modeSlice.reducer,
    isLocation : locationSlice.reducer,
    isLanguage : languageSlice.reducer,
  }
})
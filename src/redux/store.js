import { configureStore } from "@reduxjs/toolkit";
import isMode from "./modeState";
import authSlice from "./userState";

export default configureStore({
  reducer:{
    authSlice : authSlice.reducer,
    isMode : isMode.reducer,
  }
})
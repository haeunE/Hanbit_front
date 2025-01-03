import { configureStore } from "@reduxjs/toolkit";
import isAuth from "./userState";
import authSlice from "./userState";

export default configureStore({
  reducer:{
    isAuth : isAuth.reducer,
    authSlice : authSlice.reducer,
  }
})
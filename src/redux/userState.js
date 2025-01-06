import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuth: false, user: null, token: null },
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.user = action.payload.user;  // 사용자 정보
      state.token = action.payload.token;  // JWT
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice;
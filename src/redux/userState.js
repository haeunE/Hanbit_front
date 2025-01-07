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
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // 변경된 필드를 기존 값에 병합
    }
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice;
import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name : "isLanguage",
  initialState : "ko", //한국어 : ko, 영어 : en, 중국어 : zh, 일본어 : ja
  reducers : {
    SetLanguage(state, action){
      return action.payload
    }
  }
})

export const {SetLanguage} = languageSlice.actions;
export default languageSlice ;
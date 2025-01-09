import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name : "isLanguage",
  initialState : "korean",
  reducers : {
    SetLanguage(state, action){
      return action.payload
    }
  }
})

export const {SetLanguage} = languageSlice.actions;
export default languageSlice ;
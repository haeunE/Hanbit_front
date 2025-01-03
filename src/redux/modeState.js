import { createSlice } from "@reduxjs/toolkit";

const isMode = createSlice({
  name:"isMode",
  initialState : true, // true : dayMode, false : nightMode
  reducers : {
    SetIsMode(state, action){
      return action.payload
    }
  }
})

export const {SetIsMode} = isMode.actions;
export default isMode;
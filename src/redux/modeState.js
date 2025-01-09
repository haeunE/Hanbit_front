import { createSlice } from "@reduxjs/toolkit";

const modeSlice = createSlice({
  name:"isMode",
  initialState : true, // true : dayMode, false : nightMode
  reducers : {
    SetIsMode(state, action){
      return action.payload
    }
  }
})

export const {SetIsMode} = modeSlice.actions;
export default modeSlice;
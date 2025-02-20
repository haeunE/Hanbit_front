import { createSlice } from "@reduxjs/toolkit";

const weatherFutureSlice = createSlice({
  name:"weather_f",
  initialState: { air: null, weather: null},
  reducers : {
    weather:(state, action)=>{
      state.air = action.air;
      state.weather = action.weather;
    },
    uploadAir:(state,action)=>{
      state.air = action
    },
    uploadWeather:(state,action)=>{
      state.weather = action
    }
  }
})

export const { weather, uploadAir, uploadWeather } = weatherFutureSlice.actions;
export default weatherFutureSlice;
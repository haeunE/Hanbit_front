import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
  name : "isLocation",
  initialState : { latitude: null, longitude: null, region:null, city:null},
  reducers : {
    SetIsLocation(state, action) {
      const { latitude, longitude, region, city } = action.payload;
      state.latitude = latitude;
      state.longitude = longitude;
      state.region = region;
      state.city = city;
    }
  }
})

export const {SetIsLocation} = locationSlice.actions;
export default locationSlice;
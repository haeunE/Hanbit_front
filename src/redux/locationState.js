import { createSlice } from "@reduxjs/toolkit";

const location = createSlice({
  name : "location",
  initialState : { latitude: null, longitude: null, region:null },
  reducers : {
    SetIsLocation(state, action) {
      const { latitude, longitude, region } = action.payload;
      state.latitude = latitude;
      state.longitude = longitude;
      state.region = region;
    }
  }
})

export const {SetIsLocation} = location.actions;
export default location;
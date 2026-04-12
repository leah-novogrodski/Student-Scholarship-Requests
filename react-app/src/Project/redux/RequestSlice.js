import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentRequest: {},
  count: 0,
};
const RequestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    addRequest: (state, action) => {
      state.count += 1;
      const newRequest = {
        id: "REQ - 00" + state.count,
        status: "בהמתנה",
        ...action.payload,
      };

      state.list.push(newRequest);
    },
    setCurrentRequest: (state, action) => {
      const { key, value } = action.payload;
      state.currentRequest[key] = value;
    },
    allowRequest: (state, action) => {
      const { id, updatedAt } = action.payload;
      const req = state.list.find((r) => r.id === id);
      if (req) {
        req.status = "אושרה";
        req.lastUpdated = updatedAt;
      }
    },
    rejectRequest: (state, action) => {
      const { id, updatedAt } = action.payload;
      const req = state.list.find((r) => r.id === id);
      if (req) {
        req.status = "הבקשה נדחתה";
        req.lastUpdated = updatedAt;
      }
    },
   
  },
});

export const {
  addRequest,
  allowRequest,
  rejectRequest,
  setCurrentRequest,
} = RequestSlice.actions;
export default RequestSlice.reducer;

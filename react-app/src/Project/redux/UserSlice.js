import { createSlice, current } from "@reduxjs/toolkit";
import { use } from "react";

const initialState = {
  list: [
    { id: "123", password: "123", name: "Yossi" },
    { id: "456", password: "456", name: "Miri" },],
  currentUser: { id: "", password: "" },
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const exists = state.list.find((user) => user.id === action.payload.id);
      if (!exists) {
        state.list.push(action.payload);
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { addUser, setCurrentUser } = UserSlice.actions;
export default UserSlice.reducer;

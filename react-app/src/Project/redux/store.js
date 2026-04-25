import { configureStore } from "@reduxjs/toolkit";
import { configure } from "@testing-library/dom";
import UserSlice from "./UserSlice";
import RequestSlice from "./RequestSlice";



const store=configureStore({
    reducer:{
       user: UserSlice,
         request: RequestSlice

    }
});

export default store;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import jobReducer from "./jobSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        job: jobReducer,
    }
});

export default store;
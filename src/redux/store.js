import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loadersSlice";
import { usersSlice } from "./usersSlice";

export const store = configureStore({
    reducer: {
        loaders: loaderSlice.reducer,
        users: usersSlice.reducer,
    },
});
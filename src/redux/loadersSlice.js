import { createSlice } from "@reduxjs/toolkit";

export const loaderSlice = createSlice({
    name: 'loaders',
    initialState: {
        loading: false,
    },
    reducers: {
        ShowLoading: (state) => {
            state.loading = true;
        },
        HideLoading: (state) => {
            state.loading = false;
        }
    }
});

export const { ShowLoading, HideLoading } = loaderSlice.actions;

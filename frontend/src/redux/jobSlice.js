import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        myJobs: [],
        singleJob: null,
        searchQuery: "",
        loading: false,
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setMyJobs: (state, action) => {
            state.myJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setAllJobs, setMyJobs, setSingleJob, setSearchQuery, setLoading } = jobSlice.actions;
export default jobSlice.reducer;
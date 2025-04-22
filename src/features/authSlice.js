import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //user: null,
user: JSON.parse(localStorage.getItem('user')) || null,
token: localStorage.getItem('token') || null,
 // token: null,
  error: null,
  isLoading: false,
  status: "idle"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.details;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.details));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },

    initialStateFromLocalStorage: (state) => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem("token");

      if(user && token){
        state.user = user;
        state.token = token;
      }
    }
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  clearError,
  // bookmarkPostSuccess,
  initialStateFromLocalStorage,
} = authSlice.actions;

export default authSlice.reducer;

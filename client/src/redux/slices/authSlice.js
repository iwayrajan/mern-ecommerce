import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("authUser");
const initialState = {
  user:  saved ? JSON.parse(saved) : null,
  token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload: { user, token } }) {
      state.user  = user;
      state.token = token;
      localStorage.setItem("authUser",  JSON.stringify(user));
      localStorage.setItem("authToken", token);
    },
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser  = (s) => s.auth.user;
export const selectCurrentToken = (s) => s.auth.token;
export const selectIsAdmin      = (s) => s.auth.user?.role === "admin";

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false
  },
  reducers: {
    loginSuccess(state) {
      state.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', true);
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.setItem('isAuthenticated', false);

    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
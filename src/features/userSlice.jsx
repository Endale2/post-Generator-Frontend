// src/features/userSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axiosConfig';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axios.get('/auth/user', { withCredentials: true });
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    role: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.role = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.role = action.payload.role;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

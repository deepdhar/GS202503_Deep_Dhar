import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '../../types';

interface StoresState {
  items: Store[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StoresState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
  const mockStores: Store[] = [];
  return mockStores;
});


const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    addStore: (state, action: PayloadAction<Omit<Store, 'id'>>) => {
      const newId = Math.max(0, ...state.items.map(s => s.id)) + 1;
      state.items.push({ ...action.payload, id: newId });
    },
    deleteStore: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(store => store.id !== action.payload);
    },
    updateStore: (state, action: PayloadAction<Store>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    reorderStores: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const items = [...state.items];
      const [movedItem] = items.splice(action.payload.oldIndex, 1);
      items.splice(action.payload.newIndex, 0, movedItem);
      state.items = items;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch stores';
      });
  }
});

export const { addStore, deleteStore, updateStore, reorderStores } = storeSlice.actions;
export default storeSlice.reducer;
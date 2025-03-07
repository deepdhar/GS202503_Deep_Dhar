import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU } from '../../types';

interface SKUState {
  items: SKU[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SKUState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchSKUs = createAsyncThunk('skus/fetchSKUs', async () => {
  const mockSKUs: SKU[] = [];
  return mockSKUs;
});

const skuSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    addSKU: (state, action: PayloadAction<SKU>) => {
      state.items.push(action.payload);
    },
    deleteSKU: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(sku => sku.id !== action.payload);
    },
    updateSKU: (state, action: PayloadAction<SKU>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    reorderSKUs: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const items = [...state.items];
      const [movedItem] = items.splice(action.payload.oldIndex, 1);
      items.splice(action.payload.newIndex, 0, movedItem);
      state.items = items;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSKUs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSKUs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSKUs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch SKUs';
      });
  }
});

export const { addSKU, deleteSKU, updateSKU, reorderSKUs } = skuSlice.actions;
export default skuSlice.reducer;
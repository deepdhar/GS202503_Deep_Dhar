import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SKU } from '../../types';

interface SKUState {
  items: SKU[];
}

const initialState: SKUState = {
  items: []
};

const skuSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    addSKU: (state, action: PayloadAction<Omit<SKU, 'id'>>) => {
      const newId = `SKU-${Date.now()}`;
      state.items.push({ ...action.payload, id: newId });
    },
    updateSKU: (state, action: PayloadAction<SKU>) => {
      const index = state.items.findIndex(s => s.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeSKU: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(s => s.id !== action.payload);
    }
  }
});

export const { addSKU, updateSKU, removeSKU } = skuSlice.actions;
export default skuSlice.reducer;
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
  }
});

export const { addSKU, deleteSKU, updateSKU, reorderSKUs } = skuSlice.actions;
export default skuSlice.reducer;
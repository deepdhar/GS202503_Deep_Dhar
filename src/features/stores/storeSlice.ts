import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Store } from '../../types';

interface StoresState {
  items: Store[];
}

const initialState: StoresState = {
  items: []
};

// const storeSlice = createSlice({
//   name: 'stores',
//   initialState,
//   reducers: {
//     addStore: (state, action: PayloadAction<Omit<Store, 'id'>>) => {
//       const newId = Math.max(0, ...state.items.map(s => s.id)) + 1;
//       state.items.push({ ...action.payload, id: newId });
//     },
//     updateStore: (state, action: PayloadAction<Store>) => {
//         const index = state.items.findIndex(s => s.id === action.payload.id);
//         if (index !== -1) state.items[index] = action.payload;
//     },
//     removeStore: (state, action: PayloadAction<number>) => {
//         state.items = state.items.filter(s => s.id !== action.payload);
//     },
//     reorderStores: (
//       state,
//       action: PayloadAction<{ startIndex: number; endIndex: number }>
//     ) => {
//       const [removed] = state.items.splice(action.payload.startIndex, 1);
//       state.items.splice(action.payload.endIndex, 0, removed);
//     },
//     deleteStore: (state, action: PayloadAction<number>) => {
//       state.items = state.items.filter(store => store.id !== action.payload);
//     }
//   }
// });

// export const { addStore, updateStore, removeStore, reorderStores, deleteStore } = storeSlice.actions;
// export default storeSlice.reducer;

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
  }
});

export const { addStore, deleteStore, updateStore, reorderStores } = storeSlice.actions;
export default storeSlice.reducer;
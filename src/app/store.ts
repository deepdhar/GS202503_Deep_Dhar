import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import storesReducer from '../features/stores/storeSlice';
import skusReducer from '../features/skus/skuSlice';
import planningReducer from '../features/planning/planningSlice';

export const store = configureStore({
  reducer: {
    stores: storesReducer,
    skus: skusReducer,
    planning: planningReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable for performance
      serializableCheck: false
    })
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

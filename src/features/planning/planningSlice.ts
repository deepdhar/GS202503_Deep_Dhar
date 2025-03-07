import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanningRow } from '../../types';
import { RootState } from '../../app/store';
import Store  from '../stores/storeSlice';
import SKU  from '../skus/skuSlice';
import { endOfYear, startOfYear, eachWeekOfInterval, format } from 'date-fns';
import { produce } from 'immer';

interface PlanningState {
  rows: PlanningRow[];
}

const initialState: PlanningState = {
  rows: []
};

const generateEmptyWeeks = (start: Date, end: Date) => {
  const weeks = eachWeekOfInterval({ start, end });
  return weeks.reduce((acc, week) => {
    const weekKey = format(week, 'yyyy-MM-dd');
    acc[weekKey] = {
      salesUnits: null,
      salesDollars: null,
      gmDollars: null,
      gmPercent: null
    };
    return acc;
  }, {} as PlanningRow['weeks']);
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    initializeData: (state, action: PayloadAction<{
        stores: Store[];
        skus: SKU[];
      }>) => {
      const currentYear = new Date().getFullYear();
      const start = startOfYear(new Date(currentYear, 0, 1));
      const end = endOfYear(new Date(currentYear, 11, 31));

      state.rows = action.payload.stores.flatMap(store => 
        action.payload.skus
          .filter(sku => sku.storeId === store.id)
          .map(sku => ({
          storeId: store.id,
          skuId: sku.id,
          price: sku.price,
          cost: sku.cost,
          weeks: generateEmptyWeeks(start, end)
        }))
      );
    },

    updateSalesUnits: (state, action: PayloadAction<{
      storeId: number;
      skuId: string;
      week: string;
      value: number;
    }>) => {
        const row = state.rows.find(r => 
          r.storeId === action.payload.storeId && 
          r.skuId === action.payload.skuId
        );

        if (row) {
          const weekKey = action.payload.week;
          const weekData = row.weeks[weekKey];

          if (weekData) {
            console.log(weekData);
            weekData.salesUnits = action.payload.value;
            weekData.salesDollars = action.payload.value * row.price;
            weekData.gmDollars = weekData.salesDollars - (action.payload.value * row.cost);
            weekData.gmPercent = weekData.salesDollars > 0 
              ? weekData.gmDollars / weekData.salesDollars : 0;
          }
        }
    }
  },
  extraReducers: (builder) => {
    // When a new store is added
    builder.addCase('stores/addStore', (state, action: PayloadAction<Store>) => {
      const newStore = action.payload;
      const skus = Array.from(new Set(state.rows.map(row => row.skuId)));
      
      skus.forEach(skuId => {
        state.rows.push({
          storeId: newStore.id,
          skuId,
          price: 0, // Will be updated from SKU data
          cost: 0,  // Will be updated from SKU data
          weeks: generateEmptyWeeks()
        });
      });
    });

    // When a store is deleted
    builder.addCase('stores/deleteStore', (state, action: PayloadAction<number>) => {
      state.rows = state.rows.filter(row => row.storeId !== action.payload);
    });

    // When a new SKU is added
    builder.addCase('skus/addSKU', (state, action: PayloadAction<SKU>) => {
      const newSKU = action.payload;
      const stores = Array.from(new Set(state.rows.map(row => row.storeId)));
      
      stores.forEach(storeId => {
        state.rows.push({
          storeId,
          skuId: newSKU.id,
          price: newSKU.price,
          cost: newSKU.cost,
          weeks: generateEmptyWeeks()
        });
      });
    });

    // When a SKU is deleted
    builder.addCase('skus/deleteSKU', (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter(row => row.skuId !== action.payload);
    });

    // When SKU details are updated
    builder.addCase('skus/updateSKU', (state, action: PayloadAction<SKU>) => {
      const updatedSKU = action.payload;
      state.rows.forEach(row => {
        if (row.skuId === updatedSKU.id) {
          row.price = updatedSKU.price;
          row.cost = updatedSKU.cost;
          // Recalculate all weeks
          Object.keys(row.weeks).forEach(week => {
            if (row.weeks[week].salesUnits !== null) {
              row.weeks[week].salesDollars = row.weeks[week].salesUnits! * updatedSKU.price;
              row.weeks[week].gmDollars = row.weeks[week].salesDollars - 
                (row.weeks[week].salesUnits! * updatedSKU.cost);
              row.weeks[week].gmPercent = row.weeks[week].salesDollars > 0 ? 
                row.weeks[week].gmDollars / row.weeks[week].salesDollars : 0;
            }
          });
        }
      });
    });
  }
});

export const { initializeData, updateSalesUnits } = planningSlice.actions;
// export const selectPlanningData = (state: RootState) => state.planning.rows;
export default planningSlice.reducer;

export const initializePlanningData = createAsyncThunk(
  'planning/initialize',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    dispatch(initializeData({
      stores: state.stores.items,
      skus: state.skus.items
    }));
  }
);
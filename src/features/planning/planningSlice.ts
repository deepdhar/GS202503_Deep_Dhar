import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PlanningRow } from '../../types';
import { RootState } from '../../app/store';
import Store  from '../stores/storeSlice';
import SKU  from '../skus/skuSlice';
import { endOfYear, startOfYear, eachWeekOfInterval, format } from 'date-fns';

interface PlanningState {
  rows: PlanningRow[];
  excelData: PlanningRow[] | null;
  useExcelData: boolean;
}

const initialState: PlanningState = {
  rows: [],
  excelData: null,
  useExcelData: false
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
      const rowIndex = state.rows.findIndex(r => 
        r.storeId === action.payload.storeId && 
        r.skuId === action.payload.skuId
      );

      if (rowIndex>-1) {
        const row = state.rows[rowIndex];
        const weekKey = action.payload.week

        const updatedWeek = {
          ...row.weeks[weekKey],
          salesUnits: action.payload.value,
          salesDollars: action.payload.value * row.price,
          gmDollars: (action.payload.value * row.price) - (action.payload.value * row.cost),
          gmPercent: ((action.payload.value * row.price) - (action.payload.value * row.cost)) / 
                    (action.payload.value * row.price) || 0
        };

        state.rows[rowIndex] = {
          ...row,
          weeks: {
            ...row.weeks,
            [weekKey]: updatedWeek
          }
        };
      }
    },

    importExcelData: (state, action: PayloadAction<PlanningRow[]>) => {
      state.excelData = action.payload;
      state.useExcelData = true;
    },
    toggleDataView: (state) => {
      state.useExcelData = !state.useExcelData;
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

export const { initializeData, updateSalesUnits, importExcelData, toggleDataView } = planningSlice.actions;
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
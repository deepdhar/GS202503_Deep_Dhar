import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanningRow } from '../../types';
import { RootState } from '../../app/store';

interface PlanningState {
  rows: PlanningRow[];
}

const initialState: PlanningState = {
  rows: []
};

const planningSlice = createSlice({
  name: 'planning',
  initialState,
  reducers: {
    initializeData: (state, action: PayloadAction<{
      stores: { id: number }[],
      skus: { id: string, price: number, cost: number }[]
    }>) => {
      const weeks = Array.from({ length: 52 }, (_, i) => `W${i + 1}`);
      state.rows = action.payload.stores.flatMap(store => 
        action.payload.skus.flatMap(sku => 
          weeks.map(week => ({
            storeId: store.id,
            skuId: sku.id,
            week,
            salesUnits: null,
            salesDollars: null,
            gmDollars: null,
            gmPercent: null,
            price: sku.price,
            cost: sku.cost
          }))
        )
      );
    },
    updateSalesUnits: (state, action: PayloadAction<{
      storeId: number,
      skuId: string,
      week: string,
      value: number
    }>) => {
      const row = state.rows.find(r => 
        r.storeId === action.payload.storeId &&
        r.skuId === action.payload.skuId &&
        r.week === action.payload.week
      );

      if (row) {
        row.salesUnits = action.payload.value;
        row.salesDollars = action.payload.value * row.price;
        row.gmDollars = row.salesDollars - (action.payload.value * row.cost);
        row.gmPercent = row.salesDollars > 0 ? row.gmDollars / row.salesDollars : 0;
      }
    }
  }
});

export const { initializeData, updateSalesUnits } = planningSlice.actions;
export const selectPlanningData = (state: RootState) => state.planning.rows;
export default planningSlice.reducer;
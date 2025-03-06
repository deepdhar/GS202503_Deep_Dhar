import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { useAppSelector } from '../../app/store';
import { PlanningRow } from '../../types';

const PlanningGrid = () => {
  const planningData = useAppSelector(state => state.planning);
  
  const columnDefs: ColDef[] = [
    { 
      headerName: 'Store', 
      field: 'storeId',
      valueFormatter: (params: ValueFormatterParams) => 
        stores.find(s => s.id === params.value)?.name || ''
    },
    {
      headerName: 'SKU',
      field: 'skuId',
      valueFormatter: (params: ValueFormatterParams) => 
        skus.find(s => s.id === params.value)?.name || ''
    },
    {
      headerName: 'Sales Units',
      field: 'salesUnits',
      editable: true,
      cellDataType: 'number'
    },
    {
      headerName: 'Sales Dollars',
      field: 'salesDollars',
      valueFormatter: (params: ValueFormatterParams) => 
        `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'GM Dollars',
      field: 'gmDollars',
      valueFormatter: (params: ValueFormatterParams) => 
        `$${params.value?.toFixed(2) || '0.00'}`
    },
    {
      headerName: 'GM %',
      field: 'gmPercent',
      valueFormatter: (params: ValueFormatterParams) => 
        `${(params.value * 100)?.toFixed(1) || '0.0'}%`,
      cellStyle: (params) => {
        const value = params.value;
        if (value >= 0.4) return { backgroundColor: '#4CAF50' };
        if (value >= 0.1) return { backgroundColor: '#FFEB3B' };
        if (value > 0.05) return { backgroundColor: '#FF9800' };
        return { backgroundColor: '#F44336' };
      }
    }
  ];

  return (
    <div className="ag-theme-material" style={{ height: '600px', width: '100%' }}>
      <AgGridReact<PlanningRow>
        rowData={planningData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default PlanningGrid;
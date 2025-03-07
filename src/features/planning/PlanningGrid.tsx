import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { eachWeekOfInterval, format, getWeek } from 'date-fns';
import { Button } from '@mui/material';
import { toggleDataView, updateSalesUnits } from './planningSlice';
import ExcelDropzone from '../../components/ExcelDropzone';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const PlanningGrid = () => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact>(null);
  const { rows, excelData, useExcelData } = useAppSelector((state) => state.planning);
  const stores = useAppSelector((state) => state.stores.items);
  const skus = useAppSelector((state) => state.skus.items);

  const [localRows, setLocalRows] = useState(() => structuredClone(rows));

  const currentData = useExcelData ? excelData : localRows;

  const getStoreName = useCallback((storeId: number) => {
    return stores.find(store => store.id === storeId)?.name || '';
  }, [stores]);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.refreshCells({ force: true });
      gridRef.current.api.redrawRows();
    }
  }, [rows]);

  useEffect(() => {
    setLocalRows(structuredClone(rows));
  }, [rows]);

  const getSKUName = useCallback((skuId: string) => {
    return skus.find(sku => sku.id === skuId)?.name || '';
  }, [skus]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'Store',
        field: 'storeId',
        pinned: 'left',
        valueGetter: params => getStoreName(params.data.storeId),
        width: 200
      },
      {
        headerName: 'SKU',
        field: 'skuId',
        pinned: 'left',
        valueGetter: params => getSKUName(params.data.skuId),
        width: 250
      }
    ];

    const currentYear = new Date().getFullYear();
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear, 11, 31);
    
    const weeks = eachWeekOfInterval({ start, end });
    const monthGroups = new Map<string, ColDef[]>();

    weeks.forEach(week => {
      const month = format(week, 'MMMM');
      const weekNumber = getWeek(week).toString().padStart(2, '0');
      const weekKey = format(week, 'yyyy-MM-dd');

      if (!monthGroups.has(month)) {
        monthGroups.set(month, []);
      }

      const weekColumn: ColDef = {
        headerName: `W${weekNumber}`,
        marryChildren: true,
        children: [
          {
            headerName: 'Sales Units',
            field: `weeks.${weekKey}.salesUnits`,
            editable: true,
            width: 140,
            cellDataType: 'number',
            cellStyle: { textAlign: 'right' }
          },
          {
            headerName: 'Sales Dollars',
            field: `weeks.${weekKey}.salesDollars`,
            width: 150,
            valueFormatter: params => 
              params.value?.toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2
              }) || '-',
            cellStyle: { textAlign: 'right' }
          },
          {
            headerName: 'GM Dollars',
            field: `weeks.${weekKey}.gmDollars`,
            width: 150,
            valueFormatter: params => 
              params.value?.toLocaleString('en-US', { 
                style: 'currency', 
                currency: 'USD',
                minimumFractionDigits: 2
              }) || '-',
            cellStyle: { textAlign: 'right' }
          },
          {
            headerName: 'GM Percent',
            field: `weeks.${weekKey}.gmPercent`,
            width: 150,
            valueFormatter: params => 
              params.value ? `${(params.value * 100).toFixed(1)}%` : '0.0%',
            cellStyle: params => {
              const value = params.value || 0;
              return {
                backgroundColor: 
                  value >= 0.4 ? '#4CAF50' :
                  value >= 0.1 ? '#FFEB3B' :
                  value > 0.05 ? '#FF9800' : '#F44336',
                color: value >= 0.4 ? 'white' : 'black',
                textAlign: 'center',
                fontWeight: 'bold'
              };
            }
          }
        ]
      };

      monthGroups.get(month)?.push(weekColumn);
    }, [stores,skus]);

    // Add month group columns
    Array.from(monthGroups).forEach(([month, weekColumns]) => {
      baseColumns.push({
        headerName: month,
        headerClass: 'month-header',
        children: weekColumns,
        marryChildren: true
      });
    });

    return baseColumns;
  }, [getStoreName, getSKUName]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    // filter: true,
    suppressMovable: true
  }), []);

  const onCellValueChanged = useCallback((params: any) => {
    if (params.colDef.field?.includes('.salesUnits')) {
      const [_, weekKey] = params.colDef.field.split('.weeks.');
      const { storeId, skuId } = params.data;

      dispatch(updateSalesUnits({
        storeId,
        skuId,
        week: weekKey.replace('salesUnits', ''),
        value: params.newValue
      }));
    }
  }, [dispatch]);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <ExcelDropzone />
        <Button
          sx={{
            height: 100
          }}
          variant="contained"
          onClick={() => dispatch(toggleDataView())}
        >
          {useExcelData ? 'View Original Data' : 'View Excel Data'}
        </Button>
      </div>

      <div style={{ height: 'calc(100vh - 240px)', width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          ref={gridRef}
          rowData={currentData || []}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          suppressRowClickSelection
          animateRows
          groupHeaderHeight={40}
          headerHeight={40}
          rowHeight={35}
          className="ag-theme-material"
          enableRangeSelection
          enableCellTextSelection
        />
      </div>
    </div>
  );
};

export default PlanningGrid;
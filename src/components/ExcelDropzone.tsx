// components/ExcelDropzone.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { useAppDispatch } from '../app/store';
import { importExcelData } from '../features/planning/planningSlice';

const ExcelDropzone = () => {
  const dispatch = useAppDispatch();

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Transform Excel data to match our structure
      const transformed = jsonData.map((row: any) => ({
        storeId: row.StoreID,
        skuId: row.SKU,
        price: row.Price,
        cost: row.Cost,
        weeks: Object.keys(row).reduce((acc, key) => {
          if (key.startsWith('Week')) {
            acc[key] = {
              salesUnits: row[key]?.SalesUnits,
              salesDollars: row[key]?.SalesDollars,
              gmDollars: row[key]?.GMDollars,
              gmPercent: row[key]?.GMPercent
            };
          }
          return acc;
        }, {} as any)
      }));

      dispatch(importExcelData(transformed));
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processExcelFile);
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  return (
    <div {...getRootProps()} style={{
      border: '2px dashed #007bff',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px',
      backgroundColor: isDragActive ? '#f0f8ff' : 'white'
    }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the Excel file here...</p>
      ) : (
        <p>Drag & drop an Excel file here, or click to select</p>
      )}
    </div>
  );
};

export default ExcelDropzone;
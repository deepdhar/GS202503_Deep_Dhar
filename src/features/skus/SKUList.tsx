import { useState, useCallback } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Modal, Box, Typography, TextField, IconButton, Button } from '@mui/material';
import { addSKU, deleteSKU, updateSKU, reorderSKUs } from './skuSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import { SKU } from '../../types';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const SKUList = () => {
  const dispatch = useAppDispatch();
  const skus = useAppSelector((state) => state.skus.items);
  const [open, setOpen] = useState(false);
  const [editSKU, setEditSKU] = useState<SKU | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<SKU>();

  const columnDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: (params: any) => (
        <IconButton 
          color="error"
          onClick={(e) => {
            e.stopPropagation();
              dispatch(deleteSKU(params.data.id));
          }}
          sx={{ color: '#1e1e1e' }}
        >
          <DeleteIcon fontSize='medium' />
        </IconButton>
      ),
      flex: 0.2,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    },
    { 
      headerName: 'SKU',
      field: 'name',
      flex: 1.5,
      editable: true
    },
    { 
      field: 'price', 
      headerName: 'Price',
      flex: 1,
      editable: true,
      valueFormatter: (params: any) => `$${params.value}`,
      cellDataType: 'number'
    },
    { 
      field: 'cost', 
      headerName: 'Cost',
      flex: 1,
      editable: true,
      valueFormatter: (params: any) => `$${params.value}`,
      cellDataType: 'number'
    },
    {
      field: 'actions',
      headerName: '',
      cellRenderer: (params: any) => (
        <div>
          <IconButton 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.data);
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>✏️</span>
          </IconButton>
        </div>
      ),
      width: 120,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    }
  ];

  const handleAddSKU: SubmitHandler<SKU> = (data) => {
    if (editSKU?.id) {
      dispatch(updateSKU({ ...data, id: editSKU.id }));
    } else {
      dispatch(addSKU({ ...data, id: `SKU-${Date.now()}` }));
    }
    setOpen(false);
    reset();
    setEditSKU(null);
  };

  const handleEdit = (sku: SKU) => {
    setEditSKU(sku);
    setValue('name', sku.name);
    setValue('price', sku.price);
    setValue('cost', sku.cost);
    setOpen(true);
  };

  const onRowDragEnd = useCallback((params: any) => {
    const movedNode = params.node;
    const overIndex = params.overIndex;
    
    if (movedNode.rowIndex !== overIndex) {
      dispatch(reorderSKUs({
        oldIndex: movedNode.rowIndex,
        newIndex: overIndex
      }));
    }
  }, [dispatch]);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
      

      <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          rowData={skus}
          columnDefs={columnDefs}
          domLayout='autoHeight'
          onCellValueChanged={(params) => {
            dispatch(updateSKU(params.data));
          }}
          onRowDragEnd={onRowDragEnd}
          rowDragManaged={true}
          animateRows={true}
        />
      </div>

      <Button 
        variant="contained" 
        sx={{ mb: 2 }}
        onClick={() => {
          setEditSKU(null);
          reset();
          setOpen(true);
        }}
      >
        NEW SKU
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}>
          <Typography variant="h6" mb={2}>
            {editSKU ? 'Edit SKU' : 'Add New SKU'}
          </Typography>
          <form onSubmit={handleSubmit(handleAddSKU)}>
            <TextField
              label="SKU Name"
              fullWidth
              margin="normal"
              required
              {...register('name', { required: true })}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              required
              inputProps={{ step: "0.01" }}
              {...register('price', { required: true, min: 0 })}
            />
            <TextField
              label="Cost"
              type="number"
              fullWidth
              margin="normal"
              required
              inputProps={{ step: "0.01" }}
              {...register('cost', { required: true, min: 0 })}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              {editSKU ? 'Update SKU' : 'Add SKU'}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default SKUList;
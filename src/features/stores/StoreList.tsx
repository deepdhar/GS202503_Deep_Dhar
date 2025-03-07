import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Store } from '../../types';
import StoreForm from './StoreForm';
import { AgGridReact } from '@ag-grid-community/react';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import { deleteStore, addStore, updateStore, reorderStores } from './storeSlice';
import { themeBalham } from '@ag-grid-community/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface StoreFormData {
  id?: string;
  name: string;
  city: string;
  state: string;
}

const StoreList = () => {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(state => state.stores.items);
  const [open, setOpen] = useState(false);
  const [editStore, setEditStore] = useState<StoreFormData | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<StoreFormData>();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    dispatch(reorderStores({
      startIndex: result.source.index,
      endIndex: result.destination.index
    }));
  };

  const columnDefs = [
    {
      field: 'actions',
      headerName: '',
      cellRenderer: (params: any) => (
        <IconButton 
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteStore(params.data.id))
          }}
          sx={{ color: '#1e1e1e' }}
        >
          <DeleteIcon fontSize="medium" />
        </IconButton>
      ),
      width: 120,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    },
    { field: 'id', headerName: 'S.No',  flex: 0.5 },
    { field: 'name', headerName: 'Store', flex: 2, editable: true },
    { field: 'city', flex: 1, editable: true },
    { field: 'state', flex: 1,editable: true },
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

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const handleAddStore: SubmitHandler<StoreFormData> = (data) => {
    if (editStore) {
      dispatch(updateStore({ ...data, id: editStore.id }));
    } else {
      dispatch(addStore(data));
    }
    setOpen(false);
    reset();
    setEditStore(null);
  };

  const handleEdit = (store: StoreFormData) => {
    setEditStore(store);
    setValue('name', store.name);
    setValue('city', store.city);
    setValue('state', store.state);
    setOpen(true);
  };

  const onRowDragEnd = useCallback((params: any) => {
    const movedNode = params.node;
    const overIndex = params.overIndex;

    if (movedNode.rowIndex !== overIndex) {
      dispatch(reorderStores({
        oldIndex: movedNode.rowIndex,
        newIndex: overIndex
      }));
    }
  }, [dispatch]);

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
      <div 
        className="ag-theme-material"
        style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'background.paper'
        }}
      >
        <AgGridReact
          rowData={stores}
          columnDefs={columnDefs}
          domLayout='autoHeight'
          onCellValueChanged={(params) => {
            dispatch(updateStore(params.data));
          }}
          onRowDragEnd={onRowDragEnd}
          rowDragManaged={true}
          animateRows={true}
        />
      </div>

      <Button 
        variant="contained" 
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        NEW STORE
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
            {editStore ? 'Edit Store' : 'Add New Store'}
          </Typography>
          <form onSubmit={handleSubmit(handleAddStore)}>
            <TextField
              label="Store Name"
              fullWidth
              margin="normal"
              required
              {...register('name', { required: true })}
            />
            <TextField
              label="City"
              fullWidth
              margin="normal"
              required
              {...register('city', { required: true })}
            />
            <TextField
              label="State"
              fullWidth
              margin="normal"
              required
              {...register('state', { required: true })}
            />
            <Button 
              type="submit" 
              variant="contained" 
              sx={{ mt: 2 }}
            >
              Add Store
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default StoreList;
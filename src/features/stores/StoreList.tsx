import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Store } from '../../types';
import StoreForm from './StoreForm';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import { deleteStore, addStore } from './storeSlice';
import { themeBalham } from 'ag-grid-community';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

interface StoreFormData {
  name: string;
  city: string;
  state: string;
}

const StoreList = () => {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(state => state.stores.items);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<StoreFormData>();

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
          onClick={() => dispatch(deleteStore(params.data.id))}
          sx={{ padding: '8px', color: '#1e1e1e' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
      flex: 0.1,
      cellStyle: { display: 'flex', justifyContent: 'center' }
    },
    { field: 'id', headerName: 'S.No',  flex: 0.5 },
    { field: 'name', headerName: 'Store',  flex: 2 },
    { field: 'city', flex: 1 },
    { field: 'state', flex: 1 },
    
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const gridOptions = {
    rowHeight: 50,
    headerHeight: 50,
    suppressCellFocus: true,
    domLayout: 'autoHeight' as const,
  };

  const handleAddStore: SubmitHandler<StoreFormData> = (data) => {
    dispatch(addStore(data));
    setOpen(false);
    reset();
  };

  return (
    // <div>
    //   <StoreForm />

    //   <DragDropContext onDragEnd={handleDragEnd}>
    //     <Droppable droppableId="stores">
    //       {(provided) => (
    //         <div {...provided.droppableProps} ref={provided.innerRef}>
    //           {stores.map((store, index) => (
    //             <Draggable key={store.id} draggableId={store.id.toString()} index={index}>
    //               {(provided) => (
    //                 <div
    //                   ref={provided.innerRef}
    //                   {...provided.draggableProps}
    //                   {...provided.dragHandleProps}
    //                   className="store-item"
    //                 >
    //                   <h3 style={{color: '#000'}}>{store.name}</h3>
    //                   <p style={{color: '#000'}}>{store.city}, {store.state}</p>
    //                   <button onClick={() => dispatch(deleteStore(store.id))}>Delete</button>
    //                 </div>
    //               )}
    //             </Draggable>
    //           ))}
    //           {provided.placeholder}
    //         </div>
    //       )}
    //     </Droppable>
    //   </DragDropContext>
    // </div>


    <div style={{ width: '100%', height: 'calc(100vh - 180px)' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          padding: '20px',
          backgroundColor: 'background.paper'
        }}
      >
        <AgGridReact
          rowData={stores}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={themeBalham}
          gridOptions={gridOptions}
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
          <Typography variant="h6" mb={2}>Add New Store</Typography>
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
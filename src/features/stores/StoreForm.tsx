import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/store';
import { addStore } from './storeSlice';
import { TextField, Button } from '@mui/material';

interface StoreFormData {
  name: string;
  city: string;
  state: string;
}

const StoreForm = () => {
  const { register, handleSubmit, reset } = useForm<StoreFormData>();
  const dispatch = useAppDispatch();

  const onSubmit = (data: StoreFormData) => {
    dispatch(addStore(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Store Name"
        {...register('name', { required: true })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="City"
        {...register('city', { required: true })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="State"
        {...register('state', { required: true })}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Add Store
      </Button>
    </form>
  );
};

export default StoreForm;
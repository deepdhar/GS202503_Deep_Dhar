import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/store';
import { addSKU } from './skuSlice';
import { TextField, Button } from '@mui/material';

interface SKUFormData {
  name: string;
  price: number;
  cost: number;
}

const SKUForm = () => {
  const { register, handleSubmit, reset } = useForm<SKUFormData>();
  const dispatch = useAppDispatch();

  const onSubmit = (data: SKUFormData) => {
    dispatch(addSKU(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="SKU Name"
        {...register('name', { required: true })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Price"
        type="number"
        {...register('price', { required: true, min: 0 })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cost"
        type="number"
        {...register('cost', { required: true, min: 0 })}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">
        Add SKU
      </Button>
    </form>
  );
};

export default SKUForm;
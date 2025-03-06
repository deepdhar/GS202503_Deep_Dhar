import { useAppDispatch, useAppSelector } from '../../app/store';
import { removeSKU } from './skuSlice';
import SKUForm from './SKUForm';

const SKUList = () => {
  const dispatch = useAppDispatch();
  const skus = useAppSelector(state => state.skus.items);

  return (
    <div>
      <SKUForm />
      <div className="sku-list">
        {skus.map(sku => (
          <div key={sku.id} className="sku-item">
            <h3>{sku.name}</h3>
            <p>Price: ${sku.price.toFixed(2)}</p>
            <p>Cost: ${sku.cost.toFixed(2)}</p>
            <button onClick={() => dispatch(removeSKU(sku.id))}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SKUList;
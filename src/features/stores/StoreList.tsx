import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { Store } from '../../types';
import StoreForm from './StoreForm';


const StoreList = () => {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(state => state.stores.items);
  console.log(JSON.stringify(stores, null, 2));

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    dispatch(reorderStores({
      startIndex: result.source.index,
      endIndex: result.destination.index
    }));
  };

  return (
    <div>
      <StoreForm />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="stores">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {stores.map((store, index) => (
                <Draggable key={store.id} draggableId={store.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="store-item"
                    >
                      <h3>{store.name}</h3>
                      <p>{store.city}, {store.state}</p>
                      <button onClick={() => dispatch(removeStore(store.id))}>Delete</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
    // <div style={{ paddingLeft: 200 }}>
    //   <h1 style={{backgroundColor: '#fff'}}>Stores Management</h1>
    //   <pre>{JSON.stringify(stores, null, 2)}</pre>
    // </div>
  );
};

export default StoreList;
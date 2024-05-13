import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Button, List, ListItem } from '@mui/material';

const LegendOrder = ({
  chartData,
  plotConfig,
  doBatchPlotConfigurationsSave,
}) => {
  const [items, setItems] = useState(chartData.map(el => ({
    name: el.name,
    id: el.timeseriesId,
  })));

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    const { index: sourceIndex } = source;
    const { index: destinationIndex } = destination;

    const clone = [...items];
    const movedItem = clone.splice(sourceIndex, 1);
    const newItems = [];

    clone.forEach((el, index) => {
      if (index === destinationIndex) {
        newItems.push(movedItem[0]);
      }
      newItems.push(el);
    });

    if (items.length !== newItems.length) {
      newItems.push(movedItem[0]);
    }

    setItems(newItems);
  };

  const saveLegendOrder = () => {
    const traces = plotConfig.display.traces;
    const newTraces = traces.map(trace => {
      const newOrder = items.findIndex(el => el.id === trace.timeseries_id);

      return {
        ...trace,
        trace_order: newOrder,
      };
    })

    doBatchPlotConfigurationsSave({
      ...plotConfig,
      display: {
        ...plotConfig.display,
        traces: newTraces,
      }
    })
  };

  return (
    <>
      <span>
        Drag and Drop the timeseries items below to the order you'd like the plot legend to appear in.
        <br/><i style={{ fontSize: 14 }}>Note: This will also effect the rendering of the plot, where items lower on the list are rendered last and will be the front-most trace.</i>
      </span>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='legend-order' direction='vertical'>
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps} sx={{
              border: '1px solid gray',
              borderRadius: '3px',
              marginTop: '8px',
            }}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        border: '1px dashed lightgray',
                        borderRadius: '3px',
                      }}
                    >
                      {item.name}
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        disableElevation
        className='mt-2'
        size='small'
        variant='outlined'
        color='success'
        title='Save Legend Order'
        onClick={() => saveLegendOrder()}
      >
        Save Legend Order
      </Button>
    </>
  );
};

export default LegendOrder;

import React, { useState } from 'react';
import { Button, Checkbox, IconButton, Input } from '@mui/material';
import { Check, DeleteOutline } from '@mui/icons-material';
import { MuiColorInput } from 'mui-color-input';

const newThreshold = {
  name: 'Threshold',
  data_point: 0,
  enabled: true,
  color: '#000000',
};

const Thresholds = ({
  plotConfig,
  doBatchPlotConfigurationsSave,
}) => {
  const currentShapes = plotConfig?.display?.layout?.custom_shapes || [];
  const [workingData, setWorkingData] = useState({});
  const [key, setKey] = useState(0);

  const saveThreshold = (threshold) => {
    const shapes = plotConfig?.display?.layout?.custom_shapes || [];

    if (!threshold) shapes.push(newThreshold);
    else {
      const workingShape = shapes[threshold.index];
      shapes.splice(threshold.index, 1, {
        ...workingShape,
        ...threshold,
      })
    }

    doBatchPlotConfigurationsSave({
      ...plotConfig,
      display: {
        ...plotConfig.display,
        layout: {
          ...plotConfig.display.layout,
          custom_shapes: shapes,
        },
      },
    });

    if (threshold) {
      setWorkingData(prev => ({ ...prev, [threshold.index]: undefined }))
    }

    setKey(prev => prev + 1);
  };

  const deleteThreshold = index => {
    const shapes = plotConfig?.display?.layout?.custom_shapes || [];
    shapes.splice(index, 1);

    doBatchPlotConfigurationsSave({
      ...plotConfig,
      display: {
        ...plotConfig.display,
        layout: {
          ...plotConfig.display.layout,
          custom_shapes: shapes,
        },
      },
    });

    setKey(prev => prev + 1);
  };

  return (
    <div key={key}>
      {currentShapes.length ? (
        <>
          <span>
            Below is this list of Thresholds for the current plot, including generated thresholds from alerts and manually entered thresholds.
            Each manual threshold's name and value can be edited, disabled for display, or removed completely.
          </span>
          <div className='row mt-3'>
            <div className='col-4'>
              <b>Name</b>
            </div>
            <div className='col-2'>
              <b>Value</b>
            </div>
            <div className='col-3'>
              <b>Color</b>
            </div>
            <div className='col-1'>
              <b>Enabled</b>
            </div>
            <div className='col-2' />
          </div>
          <hr className='m-0 mt-2'/>
          {currentShapes.map((shape, index) => (
            <>
              <div className='row mt-2' key={shape.name + '-' + index}>
                <div className='col-4'>
                  <Input
                    type='text'
                    value={workingData[index]?.name || shape.name}
                    onChange={e => {
                      setWorkingData(prev => ({ ...prev, [index]: { ...prev[index], name: e.target.value }}));
                    }}
                  />
                </div>
                <div className='col-2'>
                  <Input
                    type='number'
                    value={workingData[index]?.data_point || shape.data_point}
                    onChange={e => {
                      setWorkingData(prev => ({ ...prev, [index]: { ...prev[index], data_point: Number(e.target.value) }}));
                    }}
                  />
                </div>
                <div className='col-3'>
                  <MuiColorInput
                    isAlphaHidden
                    format='hex'
                    size='small'
                    value={workingData[index]?.color || shape.color}
                    onChange={val => {
                      setWorkingData(prev => ({ ...prev, [index]: { ...prev[index], color: val }}));
                    }}
                  />
                  <Input
                    hidden
                    type='text'
                    value={workingData[index]?.color || shape.color}
                    onChange={val => {
                      setWorkingData(prev => ({ ...prev, [index]: { ...prev[index], color: val }}));
                    }}
                  />
                </div>
                <div className='col-1'>
                  <Checkbox
                    size='small'
                    checked={workingData[index]?.enabled !== undefined ? workingData[index]?.enabled : shape.enabled}
                    onChange={(_e, checked) => {
                      setWorkingData(prev => ({ ...prev, [index]: { ...prev[index], enabled: checked }}));
                    }}
                  />
                </div>
                <div className='col-2 text-right'>
                  <IconButton
                    disabled={!workingData[index]}
                    size='small'
                    color='success'
                    title='Save Threshold'
                    onClick={() => {
                      saveThreshold({
                        ...workingData[index],
                        index,
                      });
                    }}
                  >
                    <Check />
                  </IconButton>
                  <IconButton
                    size='small'
                    color='error'
                    title='Delete Threshold'
                    onClick={() => deleteThreshold(index)}
                  >
                    <DeleteOutline />
                  </IconButton>
                </div>
              </div>
              <hr className='m-0 my-2' />
            </>
          ))}
        </>
      ) : (
        <span>
          No thresholds set. Click the <b>Add Threshold</b> button to create one.
        </span>
      )}
      <Button
        size='small'
        variant='outlined'
        color='info'
        title='Add New Threshold'
        className='d-inline-block mt-1'
        onClick={() => saveThreshold()}
      >
        Add Threshold
      </Button>
    </div>
  )
}

export default Thresholds;

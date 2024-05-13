import React, { useState } from 'react';
import { Button, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material';
import { connect } from 'redux-bundler-react';

const generateTimeseriesOptions = (timeseriesIds = [], timeseries = []) => {
  const options = [];

  timeseriesIds.forEach(id => {
    const found = timeseries.find(el => el.id === id);

    if (found) options.push({
      value: id,
      label: `${found?.instrument} - ${found?.name} (${found?.parameter})`,
    });
  });

  return options;
};

const SecondaryAxis = connect(
  'selectInstrumentTimeseriesItems',
  ({
    instrumentTimeseriesItems: timeseries,
    chartData,
    plotConfig,
    doBatchPlotConfigurationsSave,
  }) => {
    const [axisSettings, setAxisSettings] = useState({
      title: plotConfig?.display?.layout?.secondary_axis_title,
      timeseriesIds: plotConfig?.display?.traces?.filter(trace => trace.y_axis === 'y2').map(el => el.timeseries_id) || [],
    });
    const chartTimeseriesIds = chartData?.map(d => d.timeseriesId);
    const timeseriesOptions = generateTimeseriesOptions(chartTimeseriesIds, timeseries);

    const saveSecondaryAxisSettings = () => {
      const { title, timeseriesIds } = axisSettings;

      const newTraces = plotConfig.display.traces.map(trace => {
        let axis = 'y1';
        if (timeseriesIds.includes(trace.timeseries_id)) {
          axis = 'y2';
        }
        return {
          ...trace,
          y_axis: axis,
        };
      });

      doBatchPlotConfigurationsSave({
        ...plotConfig,
        display: {
          ...plotConfig.display,
          layout: {
            ...plotConfig.display.layout,
            secondary_axis_title: title,
          },
          traces: newTraces,
        },
      });
    };

    return (
      <>
        <span>
          Fill in the information below to apply timeseries to a secondary axis on the batch plot. If no timeseries are provided, the secondary axis will not be displayed on the plot.
        </span>
        <FormControl fullWidth className='mt-3'>
          <InputLabel htmlFor='axis-title'>Secondary Axis Title</InputLabel>
          <Input
            id='axis-title'
            type='text'
            value={axisSettings.title}
            onChange={e => setAxisSettings(prev => ({ ...prev, title: e.target.value }))}
          />
        </FormControl>
        <FormControl fullWidth className='mt-3'>
          <InputLabel htmlFor='secondary-items' sx={{ backgroundColor: '#fff', padding: '0 10px' }}>Timeseries</InputLabel>
          <Select
            multiple
            id='secondary-items'
            value={axisSettings.timeseriesIds}
            onChange={e => setAxisSettings(prev => ({ ...prev, timeseriesIds: e.target.value }))}
          >
            {timeseriesOptions?.map(option => {
              const { value, label } = option;

              return <MenuItem value={value} key={value}>{label}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <Button
          disableElevation
          className='mt-2'
          size='small'
          variant='outlined'
          color='success'
          title='Save Axis Settings'
          onClick={() => saveSecondaryAxisSettings()}
        >
          Save Axis Settings
        </Button>
      </>
    );
  },
);

export default SecondaryAxis;

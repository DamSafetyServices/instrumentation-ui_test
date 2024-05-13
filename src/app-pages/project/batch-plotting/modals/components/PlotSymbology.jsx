import React, { useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Checkbox, Select, MenuItem, FormControl, FormControlLabel, Input, InputLabel, Button } from '@mui/material';
import { useDeepCompareEffect } from 'react-use';
import { MuiColorInput } from 'mui-color-input';

import Plotly from '../../../../../app-components/chart/minify-plotly';

const Plot = createPlotlyComponent(Plotly);

const TimeseriesSettings = ({
  chartData,
  selected,
  setSettings,
}) => {
  const currentSettings = chartData.find(el => el.timeseriesId === selected);
  const { line, mode } = currentSettings || {};

  const [selectedStyles, setSelectedStyles] = useState({
    dash: line?.dash || 'solid',
    color: line?.color || '',
    width: line?.width || 3,
    markers: mode === 'lines+markers',
  });

  useEffect(() => {
    setSelectedStyles({
      dash: line?.dash || 'solid',
      color: line?.color || '',
      width: line?.width || 3,
      markers: mode === 'lines+markers',
    });
  }, [selected]);

  useDeepCompareEffect(() => {
    setSettings(selectedStyles);
  }, [selectedStyles]);
  
  return (
    <div className='row mt-4'>
      <div className='col-4'>
        <FormControl fullWidth>
          <InputLabel htmlFor='line-style' sx={{ backgroundColor: '#fff', padding: '0 10px' }}>Line Style</InputLabel>
          <Select
            id='line-style'
            defaultValue={''}
            value={selectedStyles.dash}
            onChange={e => setSelectedStyles(prev => ({ ...prev, dash: e.target.value }))}
          >
            <MenuItem value={'solid'}>Solid</MenuItem>
            <MenuItem value={'dot'}>Dotted</MenuItem>
            <MenuItem value={'dashdot'}>Dash-Dotted</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='col-4'>
        <FormControl fullWidth>
          <MuiColorInput
            isAlphaHidden
            format='hex'
            label='Line Color (Hex)'
            value={selectedStyles.color}
            onChange={val => setSelectedStyles(prev => ({ ...prev, color: val }))}
          />
          <Input
            hidden
            type='text'
            value={selectedStyles.color}
            onChange={e => setSelectedStyles(prev => ({ ...prev, color: e.target.value }))}
          />
        </FormControl>
      </div>
      <div className='col-2'>
        <FormControl fullWidth>
          <InputLabel htmlFor='line-color' sx={{ backgroundColor: '#fff', padding: '0' }}>Line Width</InputLabel>
          <Input
            type='number'
            value={selectedStyles.width}
            onChange={e => setSelectedStyles(prev => ({ ...prev, width: e.target.value }))}
          />
        </FormControl>
      </div>
      <div className='col-2'>
        <FormControl fullWidth className='mt-2'>
          <FormControlLabel
            label='Markers'
            control={(
              <Checkbox
                checked={selectedStyles.markers}
                size='small'
                onChange={(_e, checked) => setSelectedStyles(prev => ({ ...prev, markers: checked }))}
              />
            )}
          />
        </FormControl>
      </div>
    </div>
  );
};

const generateData = settings => {
  const { dash, width, color, markers } = settings || {};

  return [{
    x: [1, 2, 3, 4],
    y: [2, 1, 4, 3],
    type: 'scattergl',
    mode: markers ? 'lines+markers' : 'lines',
    showlegend: false,
    line: {
      dash: dash,
      color: color === '#ffffff' ? null : color,
      width: width,
    },
    marker: {
      size: Number(width) ? (Number(width) * 2) + 3 : 5,
      color: color === '#ffffff' ? null : color,
    },
  }]
};

const ExamplePlot = ({ settings }) => {
  const [data, setData] = useState(generateData(settings));

  useDeepCompareEffect(() => {
    setData(generateData(settings));
  }, [settings]);

  return (
    <Plot
      data={data}
      layout={{
        title: 'Line Preview',
        showlegend: false,
        autosize: true,
        height: 400,
        rows: 1,
        yaxis: {
          anchor: 'x1',
          title: ``,
        }, 
        xaxis: {
          anchor: 'y1',
          title: ``,
        },
      }}
      config={{
        repsonsive: true,
        displaylogo: false,
        displayModeBar: false,
        scrollZoom: false,
      }}
    />
  );
};

const PlotSymbology = ({
  plotConfig,
  chartData,
  doBatchPlotConfigurationsSave,
}) => {
  const [settings, setSettings] = useState({});
  const [selectedTs, setSelectedTs] = useState(undefined);

  const items = chartData.map(el => ({
    name: el.name,
    id: el.timeseriesId,
  }));

  const saveTraceSettings = () => {
    const traces = plotConfig?.display?.traces || [];
    const index = traces.findIndex(trace => trace.timeseries_id === selectedTs);
    const newTrace = {
      ...index !== -1 ? traces[index] : {},
      color: settings.color,
      show_markers: settings.markers,
      width: Number(settings.width),
      line_style: settings.dash,
    };

    traces.splice(index, 1, newTrace)

    doBatchPlotConfigurationsSave({
      ...plotConfig,
      display: {
        ...plotConfig.display,
        traces,
      },
    });
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel htmlFor='timeseries-items' sx={{ backgroundColor: '#fff', padding: '0 10px' }}>Timeseries</InputLabel>
        <Select
          id='timeseries-items'
          value={selectedTs || ''}
          onChange={e => {
            setSettings({});
            setSelectedTs(e.target.value)
          }}
        >
          {items.map(el => (
            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedTs && (
        <>
          <hr/>
          <i>Use the settings below to customize the line style for the selected timeseries. Setting line color to white/#ffffff will allow the plot to use a semi-random generated color.</i>
          <TimeseriesSettings
            setSettings={setSettings}
            selected={selectedTs}
            chartData={chartData}
          />
          <Button
            disableElevation
            className='mt-2'
            size='small'
            variant='outlined'
            color='success'
            title='Save Line Settings'
            onClick={() => saveTraceSettings(selectedTs)}
          >
            Save Line Settings
          </Button>
          <hr />
          <ExamplePlot settings={settings} />
        </>
      )}
    </>
  )
};

export default PlotSymbology;
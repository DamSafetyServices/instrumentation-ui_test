import React, { useMemo, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { subDays } from 'date-fns';
import { useDeepCompareEffect } from 'react-use';

import BatchPlotChartSettings from '../components/batch-plot-chart-settings';
import Chart from '../../../../app-components/chart/chart';
import ChartErrors from '../components/batch-plot-errors';
import { generateNewChartData } from '../helper';

const BatchPlotChart = connect(
  'doPrintSetData',
  'doTimeseriesMeasurementsFetchById',
  'doBatchPlotConfigurationsSave',
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItemsObject',
  'selectTimeseriesMeasurementsItems',
  'selectInstrumentTimeseriesItems',
  ({
    doPrintSetData,
    doTimeseriesMeasurementsFetchById,
    doBatchPlotConfigurationsSave,
    batchPlotConfigurationsActiveId: activeId,
    batchPlotConfigurationsItemsObject: batchPlotConfigs,
    timeseriesMeasurementsItems: timeseriesMeasurements,
    instrumentTimeseriesItems: timeseries,
  }) => {
    const [dateRange, setDateRange] = useState([subDays(new Date(), 365), new Date()]);
    const [threshold, setThreshold] = useState(3000);
    const [chartSettings, setChartSettings] = useState({ auto_range: false });

    const plotConfig = batchPlotConfigs[activeId];
    const plotTimeseriesIds = plotConfig?.display?.traces?.map(el => el.timeseries_id) || [];
    const plotTimeseries = timeseries.filter(ts => plotTimeseriesIds.includes(ts.id));
    const plotMeasurements = plotTimeseriesIds.map(id => timeseriesMeasurements.find(elem => elem.timeseries_id === id));
    const chartData = useMemo(() => generateNewChartData(plotMeasurements, plotTimeseries, chartSettings, batchPlotConfigs[activeId]), [plotMeasurements]);
    const withPrecipitation = plotTimeseries.some(ts => ts.parameter === 'precipitation');
    const layout = {
      xaxis: {
        autorange: chartSettings?.auto_range,
        range: dateRange,
        title: 'Date',
        showline: true,
        mirror: true,
      },
      yaxis: {
        title: 'Measurement',
        showline: true,
        mirror: true,
        domain: [0, withPrecipitation ? 0.66 : 1],
      },
      ...(plotConfig?.display?.layout?.secondary_axis_title && {
        yaxis2: {
          title: plotConfig?.display?.layout?.secondary_axis_title,
          showline: true,
          side: 'right',
          overlaying: 'y1',
          domain: [0, withPrecipitation ? 0.66 : 1],
        }
      }),
      ...(withPrecipitation && {
        yaxis3: {
          title: 'Rainfall',
          autorange: 'reversed',
          showline: true,
          mirror: true,
          domain: [0.66, 1],
        },
      }),
      shapes: plotConfig?.display?.layout?.custom_shapes?.map(shape =>
        shape.enabled ? {
          type: 'line',
          x0: dateRange[0],
          x1: dateRange[1],
          y0: shape.data_point,
          y1: shape.data_point,
          line: {
            color: shape.color,
            width: 3,
          },
        } : false).filter(e => e) || [],
      autosize: true,
      dragmode: 'pan',
      height: 600,
    };

    const savePlotSettings = (params) => {
      plotTimeseriesIds.forEach(id => doTimeseriesMeasurementsFetchById({ timeseriesId: id, dateRange, threshold }));
      doBatchPlotConfigurationsSave(...params);
    };

    /** Fetches All Timeseries Measurements used by the plot */
    useDeepCompareEffect(() => {
      const cfg = plotConfig || {};

      cfg?.display?.traces?.forEach(trace => {
        const { timeseries_id } = trace;

        doTimeseriesMeasurementsFetchById({ timeseriesId: timeseries_id, dateRange, threshold })
      });
    }, [plotConfig, dateRange, threshold]);

    return (
      <>
        <Chart
          withOverlay
          data={chartData}
          layout={layout}
          config={{
            responsive: true,
            displaylogo: false,
            displayModeBar: true,
            scrollZoom: true,
          }}
        />
        <ChartErrors
          chartData={chartData}
          timeseries={timeseries}
          plotConfig={plotConfig}
        />
        {chartSettings ? (
          <>
            <hr />
            <BatchPlotChartSettings
              plotConfig={plotConfig}
              chartData={chartData}
              threshold={threshold}
              setThreshold={setThreshold}
              dateRange={dateRange}
              setDateRange={setDateRange}
              chartSettings={chartSettings}
              setChartSettings={setChartSettings}
              savePlotSettings={savePlotSettings}
            />
          </>
        ) : null}
      </>
    );
  }
);

export default BatchPlotChart;

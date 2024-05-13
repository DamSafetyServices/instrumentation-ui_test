const getStyle = (trace) => {
  const { color, line_style, show_markers, width, y_axis } = trace;
  const lineColor = color === '#ffffff' ? null : color;
  
  return {
    type: 'scattergl',
    mode: show_markers ? 'lines+markers' : 'lines',
    showlegend: false,
    yaxis: y_axis,
    line: {
      dash: line_style,
      color: lineColor,
      width: width,
    },
    marker: {
      size: Number(width) ? (Number(width) * 2) + 3 : 5,
      color: lineColor,
    },
  };
};

export const generateNewChartData = (measurements, timeseries, chartSettings, plotConfig) => {
  const { show_comments, show_masked, show_nonvalidated } = chartSettings || {};
  const { traces } = plotConfig?.display || {};

  if (measurements.length && timeseries.length) {
    const data = measurements.map(elem => {
      if (elem && timeseries.length) {
        const { items, timeseries_id } = elem;

        if (!items?.length) return;

        const {
          instrument,
          name,
          unit,
          parameter,
        } = timeseries.find(t => t.id === timeseries_id);

        const filteredItems = items.filter(item => {
          const { masked, validated } = item;

          if (show_masked && show_nonvalidated) return true;
          if (show_masked && !validated) return false;
          else if (show_masked && validated) return true;

          if (show_nonvalidated && masked) return false;
          else if (show_nonvalidated && !masked) return true;

          if (masked || !validated) return false;
          return true;
        });

        const { x, y, hovertext } = filteredItems.reduce(
          (accum, item) => ({
            x: [...accum.x, item.time],
            y: [...accum.y, item.value],
            hovertext: [...accum.hovertext, item.annotation],
          }),
          { x: [], y: [], hovertext: [] }
        );


        const trace = traces.find(el => el.timeseries_id === timeseries_id);

        return parameter === 'precipitation' ? {
          ...getStyle(trace),
          x: x,
          y: y,
          type: 'bar',
          yaxis: 'y3',
          name: `${instrument} - ${name} (${unit})` || '',
          hovertext: show_comments ? hovertext : [],
          hoverinfo: 'x+y+text',
          showlegend: true,
          timeseriesId: timeseries_id,
        } : {
          ...getStyle(trace),
          x: x,
          y: y,
          name: `${instrument} - ${name} (${unit})` || '',
          showlegend: true,
          hovertext: show_comments ? hovertext : [],
          hoverinfo: 'x+y+text',
          timeseriesId: timeseries_id,
        };
      }
    }).filter(e => e);

    return data || [];
  }

  return [];
};

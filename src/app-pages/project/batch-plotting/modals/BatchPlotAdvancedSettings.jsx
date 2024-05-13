import React from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';
import Accordion from '../../../../app-components/accordion';
import Thresholds from './components/Thresholds';
import LegendOrder from './components/LegendOrder';
import SecondaryAxis from './components/SecondaryAxis';
import PlotSymbology from './components/PlotSymbology';

const BatchPlotAdvancedSettings = connect(
  'doBatchPlotConfigurationsSave',
  ({
    doBatchPlotConfigurationsSave,
    plotConfig = {},
    chartData = [],
  }) => (
    <Modal.ModalContent style={{ overflow: 'auto' }}>
      <Modal.ModalHeader title='Batch Plot Advanced Settings' />
      <Modal.ModalBody style={{ overflow: 'auto' }}>
        <Accordion.List>
          <Accordion.Item headingText='Threshold Lines'>
            <div className='p-3 border-bottom'>
              {/* Show list of thresholds | display on/off | edit/delete options */}
              <Thresholds
                plotConfig={plotConfig}
                doBatchPlotConfigurationsSave={doBatchPlotConfigurationsSave}
              />
            </div>
          </Accordion.Item>
          <Accordion.Item headingText='Secondary Y-Axis'>
            <div className='p-3 border-bottom'>
              {/* Secondary Y-Axis: Name | Parameter to fill | on/off */}
              <SecondaryAxis
                plotConfig={plotConfig}
                chartData={chartData}
                doBatchPlotConfigurationsSave={doBatchPlotConfigurationsSave}
              />
            </div>            
          </Accordion.Item>
          <Accordion.Item headingText='Plot Symbology'>
            <div className='p-3 border-bottom'>
              {/*
                Show list of all instruments/parameters. each needs options:
                color | line-type | marker
                <br/>
                Possibly break down by automatic/manually uploaded data?
              */}
              <PlotSymbology
                plotConfig={plotConfig}
                chartData={chartData}
                doBatchPlotConfigurationsSave={doBatchPlotConfigurationsSave}
              />
            </div>    
          </Accordion.Item>
          <Accordion.Item headingText='Legend Customization'>
            <div className='p-3 border-bottom'>
              {/* Ability To Change the order of the timeseries in the legend */}
              <LegendOrder
                chartData={chartData}
                plotConfig={plotConfig}
                doBatchPlotConfigurationsSave={doBatchPlotConfigurationsSave}
              />
            </div>       
          </Accordion.Item>
        </Accordion.List>
      </Modal.ModalBody>
      <Modal.ModalFooter
        showCancelButton
        showSaveButton={false}
        cancelText='Close'
      />
    </Modal.ModalContent>
  )
);

export default BatchPlotAdvancedSettings;

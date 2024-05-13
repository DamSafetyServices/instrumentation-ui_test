import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { FormControl, Input, InputLabel, MenuItem, Select, Switch } from '@mui/material';
import ReactDatePicker from 'react-datepicker';

import * as Modal from '../../../../app-components/modal';
import Card from '../../../../app-components/card';
import { DateTime } from 'luxon';

const timePatterns = ['', 'Custom', '1 month', '1 year', '5 years', 'Lifetime'];

const requiredFields = {
  name: '',
  description: '',
  plot_configs: [],
};

const initFormState = (initValue = {}) => {
  const {
    name = '',
    description = '',
    plot_configs = [],
    global_overrides = {
      date_range: {
        enabled: false,
        value: '',
        customStart: null, // YYYY-MM-DD YYYY-MM-DD
        customEnd: null,
      },
      show_masked: {
        enabled: false,
        value: '',
      },
      show_nonvalidated: {
        enabled: false,
        value: '',
      }
    },
  } = initValue;

  if (!timePatterns.includes(global_overrides.date_range.value)) {
    const [start, end] = String(global_overrides.date_range.value).split(' ');
    global_overrides.date_range.value = 'Custom';
    global_overrides.date_range.customStart = start;
    global_overrides.date_range.customEnd = end;
  }

  return {
    name,
    description,
    plot_configs: plot_configs.map(el => el.id),
    global_overrides,
  };
};

const setGlobalOverrides = (prev, key, subkey, value) => ({
  ...prev,
  global_overrides: {
    ...prev.global_overrides,
    [key]: {
      ...prev.global_overrides[key],
      [subkey]: value,
    },
  },
})

const NewReportConfigContent = connect(
  'doCreateNewReportConfiguration',
  'doUpdateReportConfiguration',
  'selectBatchPlotConfigurationsItems',
  ({
    doCreateNewReportConfiguration,
    doUpdateReportConfiguration,
    batchPlotConfigurationsItems: plots,
    isEdit = false,
    data = {},
  }) => {
    const [formState, setFormState] = useState(initFormState(isEdit ? data : {}));

    const handleInputChange = (key, val) => {
      setFormState(prev => ({ ...prev, [key]: val }));
    };

    const isSaveEnabled = () => {
      const requiredKeys = Object.keys(requiredFields);

      return requiredKeys.every(key => {
        if (Array.isArray(formState[key])) {
          return formState[key].length > 0;
        } else {
          return !!formState[key];
        }
      });
    };

    const saveReportConfig = () => {
      if (isEdit) {
        doUpdateReportConfiguration({
          id: data.id,
          ...formState,
          plot_configs: formState.plot_configs?.map(c => plots.find(plot => plot.id === c)),
        });
      } else {
        doCreateNewReportConfiguration({
          ...formState,
          plot_configs: formState.plot_configs?.map(c => plots.find(plot => plot.id === c)),
        });
      }
    };

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title={`${isEdit ? 'Edit' : 'Create'} Report Configuration`} />
        <Modal.ModalBody>
          <FormControl fullWidth>
            <InputLabel required htmlFor='nameField'>Report Name</InputLabel>
            <Input
              required
              id='nameField'
              type='text'
              value={formState?.name}
              onChange={e => handleInputChange('name', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className='mt-3'>
            <InputLabel required htmlFor='descriptionField'>Description</InputLabel>
            <Input
              required
              multiline
              id='descriptionField'
              type='text'
              value={formState?.description}
              onChange={e => handleInputChange('description', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth className='mt-3'>
            <InputLabel required htmlFor='plot-items' sx={{ backgroundColor: '#fff', padding: '0 10px' }}>Batch Plot Configurations</InputLabel>
            <Select
              multiple
              id='plot-items'
              value={formState?.plot_configs}
              defaultValue={formState?.plot_configs || []}
              onChange={(e) => handleInputChange('plot_configs', e.target.value)}
            >
              {plots?.map(el => {
                const { id, name } = el;
                return (
                  <MenuItem key={id} value={id}>{name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <hr />
          <Card>
            <Card.Header text='Global Plot Overrides' />
            <Card.Body>
              <div>
                Date Range
                <Switch
                  title='Toggle Enabled'
                  checked={formState?.global_overrides?.date_range?.enabled}
                  onChange={(_e, isChecked) => setFormState(prev => setGlobalOverrides(prev, 'date_range', 'enabled', isChecked))}
                />
                <FormControl className='ml-4'>
                  <InputLabel size='small' sx={{ backgroundColor: '#fff', padding: '0 2px' }}>Presets</InputLabel>
                  <Select
                    size='small'
                    id='date-range-presets'
                    value={formState?.global_overrides?.date_range?.value}
                    onChange={e => setFormState(prev => setGlobalOverrides(prev, 'date_range', 'value', e.target.value))}
                    sx={{ width: '250px' }}
                  >
                    <MenuItem value='Custom'>Custom</MenuItem>
                    <MenuItem value='1 month'>One (1) Month</MenuItem>
                    <MenuItem value='1 year'>One (1) Year</MenuItem>
                    <MenuItem value='5 years'>Five (5) Years</MenuItem>
                    <MenuItem value='Lifetime'>Lifetime</MenuItem>
                  </Select>
                </FormControl>
                {formState?.global_overrides?.date_range?.value === 'Custom' && (
                  <div className='d-flex mt-2'>
                    <div className='mx-2'>
                      <i>Start Date</i>
                      <ReactDatePicker
                        placeholderText='YYYY-MM-DD'
                        dateFormat='yyyy-MM-dd'
                        className='form-control d-inline-block'
                        maxDate={
                          formState?.global_overrides?.date_range?.customEnd
                            ? DateTime.fromFormat(formState?.global_overrides?.date_range?.customEnd, 'yyyy-MM-dd').toJSDate()
                            : Date.now()
                          }
                        selected={
                          formState?.global_overrides?.date_range?.customStart
                            ? DateTime.fromFormat(formState?.global_overrides?.date_range?.customStart, 'yyyy-MM-dd').toJSDate()
                            : ''
                          }
                        onChange={date => setFormState(prev => setGlobalOverrides(prev, 'date_range', 'customStart', DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')))}
                      />
                    </div>
                    <div className='mx-2'>
                      <i>End Date</i>
                      <ReactDatePicker
                        placeholderText='YYYY-MM-DD'
                        dateFormat='yyyy-MM-dd'
                        className='form-control d-inline-block'
                        minDate={
                          formState?.global_overrides?.date_range?.customStart
                            ? DateTime.fromFormat(formState?.global_overrides?.date_range?.customStart, 'yyyy-MM-dd').toJSDate()
                            : null
                          }
                        maxDate={Date.now()}
                        selected={
                          formState?.global_overrides?.date_range?.customEnd
                            ? DateTime.fromFormat(formState?.global_overrides?.date_range?.customEnd, 'yyyy-MM-dd').toJSDate()
                            : ''
                          }
                        onChange={date => setFormState(prev => setGlobalOverrides(prev, 'date_range', 'customEnd', DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')))}
                      />
                    </div>
                  </div>
                )}
              </div>
              <hr />
              Masked Values
              <Switch
                title='Toggle Enabled'
                checked={formState?.global_overrides?.show_masked?.enabled}
                onChange={(_e, isChecked) => setFormState(prev => setGlobalOverrides(prev, 'show_masked', 'enabled', isChecked))}
              />
              <FormControl className='ml-4'>
                <InputLabel size='small' sx={{ backgroundColor: '#fff', padding: '0 2px' }}>Select Display Option</InputLabel>
                <Select
                  size='small'
                  id='masked-select'
                  value={String(formState?.global_overrides?.show_masked?.value)}
                  onChange={e => setFormState(prev => setGlobalOverrides(prev, 'show_masked', 'value', String(e.target.value)))}
                  sx={{ width: '250px' }}
                >
                  <MenuItem value='false'>Hide Masked Values</MenuItem>
                  <MenuItem value='true'>Show Masked Values</MenuItem>
                </Select>
              </FormControl>
              <hr />
              Non-Validated Values
              <Switch
                title='Toggle Enabled'
                checked={formState?.global_overrides?.show_nonvalidated?.enabled}
                onChange={(_e, isChecked) => setFormState(prev => setGlobalOverrides(prev, 'show_nonvalidated', 'enabled', isChecked))}
              />
              <FormControl className='ml-4'>
                <InputLabel size='small' sx={{ backgroundColor: '#fff', padding: '0 2px' }}>Select Display Option</InputLabel>
                <Select
                  size='small'
                  id='non-validated-select'
                  value={String(formState?.global_overrides?.show_nonvalidated?.value)}
                  onChange={e => setFormState(prev => setGlobalOverrides(prev, 'show_nonvalidated', 'value', String(e.target.value)))}
                  sx={{ width: '250px' }}
                >
                  <MenuItem value='false'>Hide Non-Validated Values</MenuItem>
                  <MenuItem value='true'>Show Non-Validated Values</MenuItem>
                </Select>
              </FormControl>
            </Card.Body>
          </Card>
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveIsDisabled={!isSaveEnabled()}
          onSave={saveReportConfig}
        />
      </Modal.ModalContent>
    );
  },
);

export default NewReportConfigContent;

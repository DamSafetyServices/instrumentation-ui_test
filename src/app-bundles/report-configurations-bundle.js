export default {
  name: 'reportConfigurations',
  getReducer: () => {
    const initialState = {
      projectConfigs: [],
      downloads: [],
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'UPDATE_REPORT_CONFIGURATIONS':
          return {
            ...state,
            projectConfigs: payload,
          };
        case 'UPDATE_REPORT_CONFIGURATIONS_DOWNLOADS':
          return {
            ...state,
            downloads: payload,
          };
        default:
          return state;
      }
    };
  },

  selectReportConfigurationsRaw: state => state.reportConfigurations,
  selectProjectReportConfigurations: state => state.reportConfigurations.projectConfigs,
  selectProjectReportConfigurationsDownloads: state => state.reportConfigurations.downloads,

  doFetchReportConfigurationsByProjectId: () => ({ dispatch, store, apiGet }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = `/projects/${projectId}/report_configs`;

    apiGet(uri, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_REPORT_CONFIGURATIONS',
          payload: body,
        });
      }
    });
  },

  doFetchReportConfigurationDownloads: ({ reportConfigId }) => ({ dispatch, store, apiGet }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = `/projects/${projectId}/report_configs/${reportConfigId}/downloads`;

    apiGet(uri, (err, body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        dispatch({
          type: 'UPDATE_REPORT_CONFIGURATIONS_DOWNLOADS',
          payload: body,
        });
      }
    });
  },

  doCreateNewReportConfiguration: (data) => ({ store, apiPost }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;
    const uri = `/projects/${projectId}/report_configs`;

    const body = {
      ...data,
      project_id: projectId,
    };

    apiPost(uri, body, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchReportConfigurationsByProjectId();
      }
    });
  },

  doUpdateReportConfiguration: (data) => ({ store, apiPut }) => {
    const { id, name, description, plot_configs } = data;
    const projectId = store.selectProjectsIdByRoute()?.projectId;

    const uri = `/projects/${projectId}/report_configs/${id}`;
    const body = {
      name,
      description,
      plot_configs,
    };

    apiPut(uri, body, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchReportConfigurationsByProjectId();
      }
    });
  },

  doDeleteReportConfiguration: ({ reportConfigurationId }) => ({ store, apiDelete }) => {
    const projectId = store.selectProjectsIdByRoute()?.projectId;

    const uri = `/projects/${projectId}/report_configs/${reportConfigurationId}`;

    apiDelete(uri, (err, _body) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log('todo', err);
      } else {
        store.doFetchReportConfigurationsByProjectId();
      }
    });
  },
};

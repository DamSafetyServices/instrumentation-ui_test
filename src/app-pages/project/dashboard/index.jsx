import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import BatchPlotCard from './cards/batchPlotCard';
import CollectionGroupCard from './cards/collectionGroupCard';
import DataLoggerCard from './cards/dataLoggerCard';
import InstrumentGroupCard from './cards/instrumentGroupCard';
import InstrumentStatusCard from './cards/instrumentStatusCard';
import InstrumentTypeCard from './cards/instrumentTypeCard';
import { isUserAllowed } from '../../../app-components/role-filter';
import ReportConfigsCard from './cards/reportConfigsCard';

const ProjectDashboard = connect(
  'doFetchDataLoggersByProjectId',
  'doFetchReportConfigurationsByProjectId',
  'selectProfileRolesObject',
  'selectProfileIsAdmin',
  'selectProjectsByRoute',
  ({
    doFetchDataLoggersByProjectId,
    doFetchReportConfigurationsByProjectId,
    profileRolesObject,
    profileIsAdmin,
    projectsByRoute: project,
  }) => {
    const { slug } = project;

    useEffect(() => {
      doFetchDataLoggersByProjectId();
      doFetchReportConfigurationsByProjectId();
    }, [doFetchDataLoggersByProjectId, doFetchReportConfigurationsByProjectId]);

    return (
      project ? (
        <div className='row mx-2 mb-4'>
          <div className='col-8'>
            <InstrumentGroupCard />
            <CollectionGroupCard />
            {isUserAllowed(profileRolesObject, profileIsAdmin, [`${slug.toUpperCase()}.*`])
              ? <DataLoggerCard />
              : null
            }
            <ReportConfigsCard />
          </div>
          <div className='col-4'>
            <InstrumentTypeCard />
            <InstrumentStatusCard />
            {isUserAllowed(profileRolesObject, profileIsAdmin, [`${slug.toUpperCase()}.*`])
              ? <BatchPlotCard />
              : null
            }
          </div>
        </div>
      ) : null
    );
  }
);

export default ProjectDashboard;

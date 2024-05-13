import React from 'react';
import { connect } from 'redux-bundler-react';
import { Download, Menu } from '@mui/icons-material';

import Badge from '../../../../app-components/badge';
import Button from '../../../../app-components/button';
import Card from '../../../../app-components/card';
import Dropdown from '../../../../app-components/dropdown';
import NewReportConfigContent from '../modals/newReportConfigContent';
import RoleFilter from '../../../../app-components/role-filter';
import Table from '../../../../app-components/table'

import '../../project.scss';

const NoReportConfigs = ({ doModalOpen, project }) => (
  <div className='m-3'>
    No Report Configurations in this project.
    <br />
    <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.ADMIN`]}>
      <span className='mt-3 d-inline-block'>
        Click the button below to add a new Report Configuration.
      </span>
      <Button
        isOutline
        size='small'
        variant='info'
        text='New Report Configuration'
        className='mt-2 d-block'
        handleClick={() => doModalOpen(NewReportConfigContent, {}, 'lg')}
      />
    </RoleFilter>
  </div>
);

const ReportConfigsCard = connect(
  'doModalOpen',
  'doFetchReportConfigurationDownloads',
  'selectProjectReportConfigurations',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    doFetchReportConfigurationDownloads,
    projectReportConfigurations: reportConfigs,
    projectsByRoute: project,
  }) => (
    <Card className='dashboard-card mt-3'>
      <Card.Header>
        <div className='dashboard-card-header'>
          <b>
            Report Configurations
            <Badge type='pill' variant='secondary' text={reportConfigs.length} className='ml-2'/>
          </b>
          <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
            <Dropdown.Menu
              withToggleArrow={false}
              buttonContent={<Menu fontSize='inherit' />}
              buttonClasses={['m-0', 'p-0']}
              menuClasses={['dropdown-menu-right']}
            >
              <Dropdown.Item onClick={() => doModalOpen(NewReportConfigContent, {}, 'lg')}>
                Create Report Configuation
              </Dropdown.Item>
            </Dropdown.Menu>
          </RoleFilter>
        </div>
      </Card.Header>
      <Card.Body className='mx-2 my-1' hasPaddingVertical={false} hasPaddingHorizontal={false}>
        {reportConfigs.length ? (
          <Table
            className='dashboard-table'
            data={reportConfigs}
            columns={[{
              key: 'name',
              header: 'Name',
              isSortable: true,
              render: (row, name) => (
                <Button
                  text={name}
                  variant='link'
                  color='info'
                  className='mt-0 pt-0'
                  handleClick={() => doModalOpen(NewReportConfigContent, { isEdit: true, data: row }, 'lg' )}
                />
              ),
            }, {
              key: 'creator_username',
              header: 'Created By',
              isSortable: true,
            }, {
              key: 'actions',
              header: '',
              render: (row) => (
                <Button
                  isOutline
                  size='small'
                  variant='info'
                  title='Download Report (.pdf)'
                  icon={<Download sx={{ fontSize: '18px' }} />}
                  handleClick={() => {
                    const { id } = row;
                    doFetchReportConfigurationDownloads({ reportConfigId: id });
                  }}
                />
              ),
            }]}
          />
        ) : <NoReportConfigs doModalOpen={doModalOpen} project={project} />}
      </Card.Body>
    </Card>
  )
);

export default ReportConfigsCard;

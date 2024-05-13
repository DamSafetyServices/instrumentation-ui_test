import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Box, Divider, Menu, MenuItem, Tooltip } from '@mui/material';

import RoleFilter from '../role-filter';

const getInitials = (name = '') => {
  let initials = ['U', 'N'];
  let parts = name.split('.');
  if (parts[1] && parts[1][0]) initials[0] = parts[1][0];
  if (parts[0] && parts[0][0]) initials[1] = parts[0][0];
  return initials.join('');
};

const ProfileMenu = connect(
  'doUpdateRelativeUrl',
  'selectAuthTokenPayload',
  ({
    doUpdateRelativeUrl,
    authTokenPayload: user,
  }) => {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const navigateTo = href => {
      setAnchorElNav(null);
      doUpdateRelativeUrl(href);
    };

    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title='Open Menu'>
          <span
            style={{ border: '2px solid green', borderRadius: '2em' }}
            className='nav-link ml-2 d-inline-block text-white'
            id='navbarDropdownMenuLink'
            role='button'
            onClick={e => setAnchorElNav(anchorElNav ? null : e.currentTarget)}
          >
            {`${getInitials(user.name)}`}
          </span>
        </Tooltip>
        <Menu
          keepMounted
          sx={{ mt: '45px' }}
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElNav)}
          onClose={() => setAnchorElNav(null)}
        >
          {/* SITE ADMIN ONLY, NO Allowed Roles */}
          <RoleFilter> 
            <MenuItem onClick={() => navigateTo('/admin')}>Site Administration</MenuItem>
            <Divider />
          </RoleFilter>
          {/* ALL Roles (Logged In) */}
          <MenuItem onClick={() => navigateTo('/profile')}>My Profile</MenuItem>
          <MenuItem onClick={() => navigateTo('/logout')} className='d-flex flex-column align-items-start'>
            Logout
            <small className='d-block'>Currently logged in as {user.name}</small>
          </MenuItem>
        </Menu>
      </Box>
    );
  },
);

export default ProfileMenu;

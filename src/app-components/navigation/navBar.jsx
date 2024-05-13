import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AppBar, Box,  Toolbar, Typography } from '@mui/material';
import { ChevronRight, Timeline } from '@mui/icons-material';

import DevBanner from './devBanner';
import NavItem from './navItem';
import ProfileMenu from './profileMenu';
import { useWindowSize } from 'react-use';

import './navigation.scss';

const customTheme = {
  '/': {
    theme: 'transparent',
    hideBrand: true,
  },
  '/help': {
    theme: 'transparent',
    hideBrand: true,
  },
  '/signup': {
    brand: 'Home',
  },
};

const NavBar = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectProjectsByRoute',
  'selectRelativePathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
    projectsByRoute: project,
    relativePathname: pathname,
  }) => {
    const [hideBrand, setHideBrand] = useState(false);
    const [hideProject, setHideProject] = useState(false);
    const [brand, setBrand] = useState('MIDAS');
    const [theme, setTheme] = useState('primary');
    const { width } = useWindowSize();

    const isTransparent = theme === 'transparent';
    const showDevBanner = import.meta.env.VITE_DEVELOPMENT_BANNER === 'true';    

    useEffect(() => {
      const { hideBrand, brand, theme } = customTheme[pathname] || {};

      setHideBrand(hideBrand);
      setBrand(brand || 'MIDAS');
      setTheme(theme || 'primary');
    }, [pathname]);

    useEffect(() => {
      if (width < 750) {
        setHideProject(true);
      } else {
        setHideProject(false);
      }
    })

    return (
      <>
        {showDevBanner && <DevBanner />}
        <AppBar
          position={isTransparent ? 'relative' : 'fixed'}
          sx={{
            backgroundColor: isTransparent ? 'none' : '#2C3E50',
            marginTop: showDevBanner ? '32px' : '0',
            zIndex: 10,
          }}
          color='transparent'
          elevation={isTransparent ? 0 : 1}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              {!hideBrand && (
                <>
                  <a href={`/`} className='text-white'>
                    <Timeline className='pr-1 pb-1' />
                    <Typography sx={{ fontSize: 20 }} component={'span'}>{brand}</Typography>
                  </a>
                  {project && project.name && !hideProject && (
                    <>
                      <ChevronRight fontSize='inherit' sx={{ paddingBottom: '3px', fontSize: 20, color: 'white', margin: '0 5px' }} />
                      <a href={`/${project.slug}#dashboard`} className='text-white'>
                        <Typography sx={{ fontSize: 16 }} component={'span'}>{project.name}</Typography>
                      </a>
                    </>
                  )}
                </>
              )}
            </Box>
            <Box>
              {pathname === '/help' ? (
                <NavItem href='/'>Home</NavItem>
              ) : (
                <NavItem href='/help'>Help</NavItem>
              )}
              <span className='mx-2 d-inline-block'>
                {authIsLoggedIn ? (
                  <ProfileMenu />
                ) : (
                  <NavItem handler={doAuthLogin}>Login</NavItem>
                )}
              </span>
            </Box>
          </Toolbar>
        </AppBar>
      </>
    );
  }
);

export default NavBar;

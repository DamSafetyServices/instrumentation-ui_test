import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Box, Tab, Tabs, tabsClasses } from '@mui/material';

const CustomTabPanel = props => {
  const { children, value, active, paddingTop } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== active}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      {value === active && (
        <Box sx={{ paddingTop: paddingTop ? 3 : 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SecondaryNavBar = connect(
  'selectHashStripQuery',
  ({
    hashStripQuery,
    navLinks = [],
  }) => {
    const defaultTab = hashStripQuery ? `#${hashStripQuery}` : () => {
      location.hash = navLinks[0].uri;
      return navLinks[0].uri;
    };
    const [navTab, setNavTab] = useState(defaultTab);

    const onTabChange = (_, newHash) => {
      location.hash = newHash;
      setNavTab(newHash);
    };

    // Handle External Hash Manipulation (eg: navbar)
    useEffect(() => {
      if (navTab !== `#${hashStripQuery}`) {
        setNavTab(`#${hashStripQuery}`);
      }
    }, [navTab, hashStripQuery, setNavTab]);

    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={navTab}
            onChange={onTabChange}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.25 },
              },
            }}
          >
            {navLinks.map(link => (
              <Tab key={`${link.uri}-tab`} label={link.title} value={link.uri} />
            ))}
          </Tabs>
        </Box>
        {navLinks.map(link => (
          <CustomTabPanel key={`${link.uri}-content`} value={link.uri} active={navTab} paddingTop={link.paddingSmall}>
            {link.content}
          </CustomTabPanel>
        ))}
      </>
    );
  }
);

export default SecondaryNavBar;

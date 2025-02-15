import React, { createRef, useEffect, useState } from 'react';

import TabItem from './tabItem';

import './tab.scss';
import useWindowDimensions from '../../customHooks/useWindowDimensions';
import { useDeepCompareEffect } from 'react-use';

/**
 * A component used to switch between large page contexts within a single page of the application.
 * @param {Array} tabs - THe list of tabs to be generated and the element to be displayed when active. Item structure = `{ title: string, content: Element, isHidden: boolean, paddingSmall: boolean }`
 * @param {Array} tabListClass - Class(es) to be applied to unordered list element that wraps the TabItems.
 * @param {Array} contentClass - Class(es) to be applied to the element that wraps the rendered content within the tab.
 * @param {Array} onTabChange - Callback function that is executed when the user selects a new tab. `callback(tab.title, index)`
 * @param {Array} theme - Sets the theme of the the tab container. One of `['default', 'navigation']`
 * @param {Number} defaultTab - Sets the tab, via the array index, that is open when initially rendered. Defaults to `0`
 * @param {Number} changeTabDelay - Add a delay (in ms) to the time between allowable tab changes. will mark all tabs as disabled until the timer completes.
 * @returns TabContainer `React Element`
 */
const TabContainer = ({
  tabs = [],
  tabListClass = '',
  contentClass = '',
  onTabChange = () => {},
  defaultTab = 0,
  changeTabDelay = 0,
  ...customProps
}) => {
  const ref = createRef();
  const [displayedTabs, setDisplayedTabs] = useState(tabs);
  const [tabIndex, setTabIndex] = useState(defaultTab);
  const [isDisabled, setIsDisabled] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const changeTab = (title, index) => {
    onTabChange(title, index);
    setTabIndex(index);
    changeTabDelay && setIsDisabled(true);
  };

  useEffect(() => {
    if (changeTabDelay && isDisabled) {
      setTimeout(() => setIsDisabled(false), changeTabDelay);
    }
  }, [isDisabled, setIsDisabled]);

  useDeepCompareEffect(() => {
    const diff = tabs.length - displayedTabs.length;

    if (ref.current.clientWidth > windowWidth) {
      const clone = [...tabs];
      
      clone.splice((tabs.length - diff) - 2, diff + 2);
      setDisplayedTabs(clone);
    } else {
      if (diff && ((ref.current.clientWidth + 165) < windowWidth)) {
        const clone = [...tabs];

        if (diff !== 1) {
          clone.splice(tabs.length - (diff - 1), diff - 1);
        }

        setDisplayedTabs(clone);
      }
    }
  }, [ref, windowWidth, tabs, displayedTabs]);

  return (
    <div {...customProps} style={{ overflow: 'hidden' }}>
      <ul className={`nav nav-tabs ${tabListClass}`} ref={ref}>
        {displayedTabs.map((t, i) => (
          <TabItem
            key={i}
            tab={t}
            index={i}
            changeTab={changeTab}
            isActive={tabIndex === i}
            isDisabled={isDisabled} />
        ))}
      </ul>
      <section className={`section mt-3 ${contentClass}`}>
        {tabs[tabIndex] ? tabs[tabIndex].content : (
          <p>No Content</p>
        )}
      </section>
    </div>
  );
};

export default TabContainer;

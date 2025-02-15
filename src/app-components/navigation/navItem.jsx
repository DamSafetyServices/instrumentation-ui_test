import React from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../common/helpers/utils';

const NavItem = connect(
  'selectRelativePathname',
  ({ relativePathname: pathname, href, handler, children, hidden }) => {
    const cls = classArray([
      'pointer',
      'nav-item',
      'd-inline-block',
      pathname.indexOf(href) !== -1 && href !== '/' && 'active',
    ]);

    const handleClick = (e) => {
      if (handler && typeof handler === 'function') handler(e);
    };

    return !hidden ?
      handler ? (
        <li className={cls} onClick={handleClick}>
          <span className='nav-link text-white'>{children}</span>
        </li>
      ) : (
        <li className={cls}>
          <a className='nav-link text-white p-3' href={href}>
            {children}
          </a>
        </li>
      ) : null;
  }
);

export default NavItem;

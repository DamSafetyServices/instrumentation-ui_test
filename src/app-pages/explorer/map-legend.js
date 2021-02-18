import React from 'react';
import { connect } from 'redux-bundler-react';

export default connect(
  'selectDomainsItemsByGroup',
  ({ domainsItemsByGroup: domains }) => {
    domains.status.forEach((x) => {
      x.title = x.value[0].toUpperCase() + x.value.substr(1).toLowerCase();
    });
    domains.status.sort((a, b) => (a.value > b.value ? 1 : -1));
    return (
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <div className='card' style={{ opacity: 0.8 }}>
          <div className='card-body'>
            {domains.status.map((x, i) => (
              <p className='mb-2 mt-2' key={i}>
                <svg width='15' height='15' className='mr-2'>
                  <circle
                    className={`legend-icon ${x.value}`}
                    cx='8'
                    cy='8'
                    r='5'
                  />
                </svg>
                {x.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

import React from 'react';

import Navigation from './Navigation';
import './Layout.css'

const Layout = props => {
  const {hasNavigation = true, hideNavigation, children} = props

  return (
    <div className='Layout' >
      {children}
      {hasNavigation && <Navigation hide={hideNavigation}/>}
    </div>
  );
};

export default Layout
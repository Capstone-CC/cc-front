import React from 'react';

import Navigation from './Navigation';
import './Layout.css'

const Layout = props => {
  const {hasNavigation = true, children} = props

  return (
    <div className="Layout">
      {children}
      {hasNavigation && <Navigation />}
    </div>
  );
};

export default Layout
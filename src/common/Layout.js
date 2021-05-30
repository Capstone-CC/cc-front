import React from 'react';

import Navigation from './Navigation';
import './Layout.css'
import Gnb from './Gnb';

const Layout = props => {
  const {hasNavigation = true, hasGnb = false, hideNavigation, hideGnb, title, children} = props

  return (
    <div className={`Layout ${hasNavigation ? 'nav' : ''} ${hasGnb ? 'gnb' : ''}`} >
      {hasGnb && <Gnb hide={hideGnb} title={title} />}
      {children}
      {hasNavigation && <Navigation hide={hideNavigation}/>}
    </div>
  );
};

export default Layout
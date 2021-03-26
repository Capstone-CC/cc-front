import React from 'react';
import {Link} from 'react-router-dom'

import Chat from '../images/chat.png';
import {ReactComponent as Logo} from '../images/logo.svg';
import Profile from '../images/profile.png';
import './Navigation.css'

const Navigation = props => {

  return (
    <div className="navigation">
      <Link
        to="/chat"
        role="tab"
        className="tab chat"
      >
      <img src={Chat} alt="chat" className="icon-chat" />
      </Link>
      <Link
        to="/home"
        role="tab"
        className="tab home"
      >
        <Logo className="icon-logo"/>
      </Link>
      <Link
        to="/profile"
        role="tab"
        className="tab profile"
      >
        <img src={Profile} alt="profile" className="icon-profile" />
      </Link>
    </div>
  );
};

export default Navigation
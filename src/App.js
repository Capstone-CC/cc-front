import {BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import MyProfilePage from './account/profile/MyProfilePage';
import MainPage from './home/MainPage';
import ChatListPage from './chat/ChatListPage';
import ChatRoomPage from './chat/ChatRoomPage';
import OtherProfilePage from './chat/profile/OtherProfilePage';
import LoginPage from './login/LoginPage';
import RegisterPage from './register/RegisterPage';
import Toast from './common/Toast';
import './App.css'
import PasswordFind from './password/PasswordFind';
import { useEffect, useRef } from 'react';
import AccountPage from './account/AccountPage';
import PasswordChange from './account/password/PasswordChange';
import Agreement from './account/agreement/Agreement';
import Layer from './common/Layer';

function App() {
  const app = useRef(null)
  
  useEffect(()=>{
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    app.current.style.setProperty('--vh', `${vh}px`);
  }, [app.current])
  
  return (
    <div className="App" ref={app}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/password">
            <PasswordFind />
          </Route>
          <Route path="/chat/profile/:id">
            <OtherProfilePage />
          </Route>
          <Route path="/chat/:id">
            <ChatRoomPage />
          </Route>
          <Route path="/chat">
            <ChatListPage />
          </Route>
          <Route path="/home">
            <MainPage />
          </Route>
          <Route path="/account/profile">
            <MyProfilePage />
          </Route>
          <Route path="/account/password">
            <PasswordChange />
          </Route>
          <Route path="/account/agreement">
            <Agreement />
          </Route>
          <Route path="/account">
            <AccountPage />
          </Route>

          <Redirect to="/login"/>
        </Switch>

        <Toast />

        <Layer />

      </BrowserRouter>
    </div>
  );
}

export default App;

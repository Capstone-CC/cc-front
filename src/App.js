import {BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import MyProfilePage from './profile/MyProfilePage';
import MainPage from './home/MainPage';
import ChatListPage from './chat/ChatListPage';
import LoginPage from './login/LoginPage';
import RegisterPage from './register/RegisterPage';
import Toast from './common/Toast';
import './App.css'
import ChatRoomPage from './chat/ChatRoomPage';
import PasswordFind from './password/PasswordFind';
import { useEffect, useRef } from 'react';

function App() {
  const app = useRef(null)
  
  useEffect(()=>{
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    app.current.style.setProperty('--vh', `${vh}px`);
    console.log(vh)
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
          <Route path="/chat/:id">
            <ChatRoomPage />
          </Route>
          <Route path="/chat">
            <ChatListPage />
          </Route>
          <Route path="/home">
            <MainPage />
          </Route>
          <Route path="/profile">
            <MyProfilePage />
          </Route>

          <Redirect to="/login"/>
        </Switch>

        <Toast />

      </BrowserRouter>
    </div>
  );
}

export default App;

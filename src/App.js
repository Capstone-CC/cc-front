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

function App() {
  
  return (
    <div className="App">
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

import {BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import MyProfilePage from './profile/MyProfilePage';
import MainPage from './home/MainPage';
import ChatListPage from './chat/ChatListPage';
import LoginPage from './login/LoginPage';
import RegisterPage from './register/RegisterPage';
import './App.css'

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
          <Route path="/chat">
            <ChatListPage />
          </Route>
          <Route path="/home">
            <MainPage />
          </Route>
          <Route path="/profile">
            <MyProfilePage />
          </Route>

          <Redirect to="/home"/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

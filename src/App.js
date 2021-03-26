import {BrowserRouter, Switch, Route } from 'react-router-dom';
import Navigation from './common/Navigation';
import MyProfilePage from './profile/MyProfilePage';
import './App.css'
import MainPage from './home/MainPage';
import ChatListPage from './chat/ChatListPage';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/chat">
            <ChatListPage />
          </Route>
          <Route path="/home">
            <MainPage />
          </Route>
          <Route path="/profile">
            <MyProfilePage />
          </Route>
        </Switch>
        <Navigation />
      </BrowserRouter>
    </div>
  );
}

export default App;

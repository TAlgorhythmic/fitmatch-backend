import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import Home from './Home.jsx'
import MakeFriends from './MakeFriends.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Notification from './components/Notifications/Notifications.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="friends" element={<MakeFriends />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="notifications" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

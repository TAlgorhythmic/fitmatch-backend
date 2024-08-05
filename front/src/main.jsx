import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import Home from './Home.jsx'
import MakeFriends from './MakeFriends.jsx'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import UserProfile from './components/Header/ProfileUser.jsx'
import ChangePassword from './components/Login/CambioContra.jsx'
import CompletarRegistro from './components/Register/CompletarRegistro.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="friends" element={<MakeFriends />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="nuevaContra" element={<ChangePassword />} />
          <Route path="user/profile" element={<UserProfile />} />
          <Route path="formulario" element={<CompletarRegistro />} />
        </Route>
      </Routes>
    </BrowserRouter>

)

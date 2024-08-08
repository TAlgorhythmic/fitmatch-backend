import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import Home from './Home.jsx'
import MakeFriends from './components/Swipe-MakeFriends/MakeFriends.jsx'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import UserProfile from './UserProfile.jsx'
import Agenda from './Agenda.jsx'
import ChangePassword from './components/Login/CambioContra.jsx'
import CompletarRegistro from './components/Register/CompletarRegistro.jsx'
import CreateActivitie from './components/CreateActivitie/CreateActivitie.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path='create-activitie' element={<CreateActivitie />} />
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

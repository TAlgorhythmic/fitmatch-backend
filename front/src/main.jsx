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
import CreateActivity from './CreateActivity.jsx'
import OwnActivities from './OwnActivities.jsx';
import EditActivity  from './EditActivity.jsx';
import FriendsList from './FriendsList.jsx';
import FriendData from './FriendData.jsx';
import Verify from "./components/Register/Verify.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path='create-activity' element={<CreateActivity />} />
          <Route path="friends" element={<MakeFriends />} />
          <Route path="friendsList" element={<FriendsList />} />
          <Route path="friendsView/:id" element={<FriendData />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="login" element={<Login />} />
          <Route path="nuevaContra" element={<ChangePassword />} />
          <Route path="userProfile" element={<UserProfile />} />
          <Route path="formulario" element={<CompletarRegistro />} />
          <Route path="own-activities" element={<OwnActivities />} />
          <Route path="activities/edit/:id" element={<EditActivity />} />
        </Route>
      </Routes>
    </BrowserRouter>

)

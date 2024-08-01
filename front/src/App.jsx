import Header from './components/Header.jsx'
import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App;

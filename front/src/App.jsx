import Header from './components/Header.jsx';
import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <div className="contenedorPrincipal">
        <Header />
        <Outlet />
      </div>
    </>
  )
}

export default App;

import Header from './components/Header.jsx'
import Lateral from './components/Lateral'
function App() {
  
  return (
    <>
     <Header />
     <Lateral />
     <Outlet />
    </>
  )
}

export default App;

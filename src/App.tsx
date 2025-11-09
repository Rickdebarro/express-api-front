import { Routes, Route } from 'react-router-dom';

// Nossos componentes
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      

      <Route path="/" element={<Login />} /> 

      {/* --- Rotas Protegidas --- */}
      <Route element={<ProtectedRoute />}>

        <Route path="/dashboard" element={<Dashboard />} />
        
      </Route>
    </Routes>
  );
}

export default App;
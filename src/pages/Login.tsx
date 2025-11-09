import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Adicione o Link
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth(); // Tipado!
  const navigate = useNavigate();

  // 1. Tipar o evento do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password); // Tipado!
    
    if (result.success) {
      toast.success('Login bem-sucedido!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {/* Adicione seu CSS aqui */}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
};

export default Login;
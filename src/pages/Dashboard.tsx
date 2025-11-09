import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import type { Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          toast.error('Sua sessão expirou.');
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error('Falha ao buscar tarefas');
        }

        const data: Task[] = await response.json();
        setTasks(data);
        
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, logout]);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Sair</button>
      
      <h3>Minhas Tarefas</h3>
      {loading && <p>Carregando...</p>}
      
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} (Completa: {task.completed ? 'Sim' : 'Não'})
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Dashboard;
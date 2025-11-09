import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import type { Task } from '../types';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL;


const normalizeTask = (task: any): Task => {
  const newTask = { ...task };
  
  if (newTask._id && !newTask.id) {
    newTask.id = newTask._id;
  }

  if (typeof newTask.isDone !== 'undefined' && typeof newTask.completed === 'undefined') {
    newTask.completed = newTask.isDone;
  }

  return newTask as Task; 
};


const Dashboard = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState(''); // O que o user digita

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState('');


  const checkAuth = (response: Response): boolean => {
    if (response.status === 401) {
      toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      logout();
      return true;
    }
    return false;
  };

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (checkAuth(response)) return;

      if (!response.ok) {
        throw new Error('Falha ao buscar tarefas');
      }
      
      const data: any[] = await response.json();
      const normalizedTasks = data.map(normalizeTask);
      setTasks(normalizedTasks);
      
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('401'))) {
         toast.error((error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDescription.trim() === '') {
      toast.warn('A descrição não pode estar vazia');
      return; 
    }
    try {
      const taskData = {
        description: newDescription,
        isDone: false 
      };

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData) 
      });

      if (checkAuth(response)) return;

      if (!response.ok) {
        throw new Error('Falha ao criar tarefa');
      }
      
      await fetchTasks();
      setNewDescription('');
      toast.success('Tarefa criada!');
    } catch (error) {
       toast.error((error as Error).message);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTaskData = { isDone: !task.isDone };
      
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTaskData)
      });

      if (checkAuth(response)) return;

      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }
      
      const updatedTaskRaw = await response.json();
      const updatedTask = normalizeTask(updatedTaskRaw);
      
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      toast.success('Tarefa atualizada!');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Tem certeza que deseja apagar esta tarefa?')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (checkAuth(response)) return;

      if (!response.ok) {
        throw new Error('Falha ao apagar tarefa');
      }
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Tarefa apagada');
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleToggleDetails = (taskId: string) => {
    if (selectedTaskId === taskId && !isEditing) {
      setSelectedTaskId(null);
    } else {
      setSelectedTaskId(taskId);
      setIsEditing(false);
    }
  };

  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  
  const formatTaskDate = (dateString: string) => {
    if (!dateString) return 'Data indisponível';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  const handleStartEdit = () => {
    if (selectedTask) {
      setIsEditing(true);
      setEditingText(selectedTask.description); 
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingText('');
  };

  const handleSaveEdit = async () => {
    if (!selectedTask) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: editingText })
      });

      if (checkAuth(response)) return;

      if (!response.ok) {
        throw new Error('Falha ao salvar a descrição');
      }

      const updatedTaskRaw = await response.json();
      const updatedTask = normalizeTask(updatedTaskRaw);

      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      toast.success('Descrição atualizada!');
      setIsEditing(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2>Meu Dashboard</h2>
          <button onClick={logout} className="logout-button">Sair</button>
        </div>
        
        <form onSubmit={handleCreateTask} className="task-form">
          <input 
            type="text"
            placeholder="Qual a nova tarefa?"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>

        <h3>Minhas Tarefas</h3>
        {loading && <p>Carregando...</p>}
        
        <ul className="task-list">
          {tasks.map(task => (
            <li 
              key={task.id} 
              className={`task-item ${task.isDone ? 'completed' : ''}`}
              onClick={() => handleToggleDetails(task.id)} 
            >
              <div className="task-item-details">
                <input 
                  type="checkbox"
                  checked={task.isDone}
                  onClick={(e) => e.stopPropagation()} 
                  onChange={() => handleToggleComplete(task)}
                />
                {/* O CSS cuida do "..." aqui */}
                <span>{task.description}</span> 
              </div>
              <div className="task-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteTask(task.id);
                  }}
                  className="delete-button"
                >
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
        {(!loading && tasks.length === 0) && <p>Nenhuma tarefa encontrada.</p>}
      </div>

      {/* Coluna 2: O Painel de Detalhes */}
      <div className="details-panel-wrapper">
        {selectedTask ? (
          <div className="details-panel">
            <h3>Detalhes da Tarefa</h3>
            <p><strong>Descrição:</strong></p>
            {isEditing ? (
              <div className="edit-wrapper">
                <textarea
                  className="edit-textarea"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={5}
                />
                <div className="edit-actions">
                  <button onClick={handleCancelEdit} className="cancel-button">
                    Cancelar
                  </button>
                  <button onClick={handleSaveEdit} className="save-button">
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="view-wrapper">
                <p className="details-description">{selectedTask.description}</p>
                <button onClick={handleStartEdit} className="edit-button">
                  Editar
                </button>
              </div>
            )}
            <p><strong>Status:</strong> {selectedTask.isDone ? 'Concluída' : 'Pendente'}</p>
            <p><strong>Criado em:</strong></p>
            <p>{formatTaskDate(selectedTask.createdAt)}</p>
            <p><strong>Atualizado em:</strong></p>
            <p>{formatTaskDate(selectedTask.updatedAt)}</p>
          </div>
        ) : (
          <div className="details-panel-placeholder">
            <p>Clique em uma tarefa para ver os detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
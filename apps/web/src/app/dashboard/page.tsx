'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  progress: number;
  createdAt: string;
}

interface Workspace {
  id: string;
  name: string;
  role: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  category: string;
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskType, setNewTaskType] = useState('manual');
  const [selectedAgentForTask, setSelectedAgentForTask] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchWorkspaces();
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchTasks();
    }
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/workspaces/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setWorkspaces(data);
      if (data.length > 0) {
        setSelectedWorkspace(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/v1/tasks?workspaceId=${selectedWorkspace}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/v1/agents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:3002/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          workspaceId: selectedWorkspace,
          title: newTaskTitle,
          description: newTaskDescription,
          type: newTaskType,
          priority: 'medium',
          agentId: newTaskType === 'agent' ? selectedAgentForTask : null,
        }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskType('manual');
        setSelectedAgentForTask('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const createAgent = async () => {
    if (!newAgentName.trim()) return;

    try {
      const response = await fetch('http://localhost:3002/api/v1/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newAgentName,
          description: newAgentDescription,
          type: 'custom',
          category: 'productivity',
        }),
      });

      if (response.ok) {
        setNewAgentName('');
        setNewAgentDescription('');
        fetchAgents();
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3002/api/v1/tasks/${taskId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Refresh tasks after a delay to see status change
      setTimeout(fetchTasks, 3000);
    } catch (error) {
      console.error('Error executing task:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">KARYO OS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} ({ws.role})
                  </option>
                ))}
              </select>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <textarea
                placeholder="Task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              />
              <select
                value={newTaskType}
                onChange={(e) => setNewTaskType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="manual">Manual Task</option>
                <option value="agent">Agent Task</option>
              </select>
              {newTaskType === 'agent' && (
                <select
                  value={selectedAgentForTask}
                  onChange={(e) => setSelectedAgentForTask(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={createTask}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Agent</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Agent name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <textarea
                placeholder="Agent description"
                value={newAgentDescription}
                onChange={(e) => setNewAgentDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              />
              <button
                onClick={createAgent}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Agent
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          Progress: {task.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => executeTask(task.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Execute
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tasks found. Create your first task above!
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Agents</h2>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                      <p className="text-gray-600 mt-1">{agent.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === 'active' ? 'bg-green-100 text-green-800' :
                          agent.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {agent.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No agents found. Create your first agent above!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
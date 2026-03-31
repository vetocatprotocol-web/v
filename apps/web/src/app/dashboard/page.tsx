'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  progress: number;
  createdAt: string;
  result?: string;
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

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [command, setCommand] = useState('');
  const [commandMode, setCommandMode] = useState<'manual' | 'agent' | 'hybrid'>('manual');
  const [selectedAgentForTask, setSelectedAgentForTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Initialize Socket.IO connection
    socketRef.current = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setRealTimeUpdates(prev => [...prev, 'Connected to real-time updates']);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setRealTimeUpdates(prev => [...prev, 'Disconnected from real-time updates']);
    });

    socketRef.current.on('taskStatusChanged', (data) => {
      console.log('Task status changed:', data);
      setRealTimeUpdates(prev => [...prev, `Task "${data.title}" status: ${data.status} (${data.progress}%)`]);
      fetchTasks();
    });

    socketRef.current.on('agentStatusChanged', (data) => {
      console.log('Agent status changed:', data);
      setRealTimeUpdates(prev => [...prev, `Agent "${data.name}" status: ${data.status}`]);
      fetchAgents();
    });

    fetchWorkspaces();
    fetchAgents();
    fetchFiles();
    startSession();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchTasks();
    }
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/workspaces/my', {
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
      const response = await fetch(`http://localhost:3001/api/v1/tasks?workspaceId=${selectedWorkspace}`, {
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

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/files', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const startSession = () => {
    setSessionActive(true);
    setSessionStartTime(new Date());
    setRealTimeUpdates(prev => [...prev, 'Work session started']);
  };

  const endSession = () => {
    setSessionActive(false);
    setSessionStartTime(null);
    setRealTimeUpdates(prev => [...prev, 'Work session ended']);
  };

  const processCommand = async () => {
    if (!command.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/command/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          command: command,
          workspaceId: selectedWorkspace,
          mode: commandMode,
          agentId: commandMode === 'agent' ? selectedAgentForTask : null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRealTimeUpdates(prev => [...prev, `Command processed: ${command}`]);
        setCommand('');
        fetchTasks();
      } else {
        setRealTimeUpdates(prev => [...prev, `Command failed: ${data.message}`]);
      }
    } catch (error) {
      console.error('Error processing command:', error);
      setRealTimeUpdates(prev => [...prev, 'Command processing failed']);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', selectedWorkspace);

    try {
      const response = await fetch('http://localhost:3001/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        setRealTimeUpdates(prev => [...prev, `File uploaded: ${file.name}`]);
        fetchFiles();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(uploadFile);
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3001/api/v1/tasks/${taskId}/execute`, {
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
              <h1 className="text-xl font-bold text-gray-900">KARYO OS</h1>
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
              {sessionActive ? (
                <button
                  onClick={endSession}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                  End Session
                </button>
              ) : (
                <button
                  onClick={startSession}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Start Session
                </button>
              )}
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

      {/* Command Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Ketik perintah, buat dokumen, atau olah file..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && processCommand()}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={commandMode}
              onChange={(e) => setCommandMode(e.target.value as 'manual' | 'agent' | 'hybrid')}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="manual">Mode Manual</option>
              <option value="agent">Mode Agen</option>
              <option value="hybrid">Mode Hybrid</option>
            </select>
            {commandMode === 'agent' && (
              <select
                value={selectedAgentForTask}
                onChange={(e) => setSelectedAgentForTask(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Pilih Agen</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={processCommand}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Jalankan
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Session Status */}
              {sessionActive && sessionStartTime && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Sesi Kerja Aktif</h3>
                      <p className="text-sm text-green-600">
                        Dimulai: {sessionStartTime.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-sm text-green-600">
                      Durasi: {Math.floor((Date.now() - sessionStartTime.getTime()) / 60000)} menit
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tugas</h2>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                          <p className="text-gray-600 mt-1">{task.description}</p>
                          {task.result && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <strong>Hasil:</strong> {task.result}
                            </div>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                              task.status === 'failed' ? 'bg-red-100 text-red-800' :
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
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => executeTask(task.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Jalankan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada tugas. Buat tugas pertama Anda di atas!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Real-time Updates */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Real-time</h3>
                <div className="bg-white p-4 rounded-lg shadow max-h-64 overflow-y-auto">
                  {realTimeUpdates.length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada update</p>
                  ) : (
                    realTimeUpdates.slice(-10).map((update, index) => (
                      <div key={index} className="text-sm text-gray-600 py-1 border-b border-gray-100 last:border-b-0">
                        {update}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload File</h3>
                <div className="bg-white p-4 rounded-lg shadow">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Pilih File
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload file untuk diproses AI
                  </p>
                </div>
              </div>

              {/* Files */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">File Digital Vault</h3>
                <div className="bg-white p-4 rounded-lg shadow max-h-64 overflow-y-auto">
                  {files.length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada file</p>
                  ) : (
                    files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.type}
                          </p>
                        </div>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          Gunakan AI
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Agents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Agen AI</h3>
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <div key={agent.id} className="bg-white p-3 rounded-lg shadow">
                      <h4 className="text-sm font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{agent.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </span>
                        <span className="text-xs text-gray-500">{agent.category}</span>
                      </div>
                    </div>
                  ))}
                  {agents.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Tidak ada agen
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
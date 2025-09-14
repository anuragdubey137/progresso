'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Trash2,
  UserPlus,
  X,
  PlayCircle,
  Settings,
  Filter,
  Search
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  deadline?: string;
  projectId: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    username: string;
  };
}

interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  user: {
    id: string;
    username: string;
  };
}

interface Project {
  id: string;
  name: string;
  deadline?: string;
  ownerId: string;
  owner: {
    id: string;
    username: string;
  };
  members: ProjectMember[];
  tasks: Task[];
}

const Dashboard = () => {
  // Mock session data
  const session = {
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com'
    }
  };
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  
  const [newProject, setNewProject] = useState({
    name: '',
    deadline: ''
  });
  
  const [newMember, setNewMember] = useState({
    username: ''
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assigneeUsername: ''
  });

  const [error, setError] = useState<string | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleProjects: Project[] = [
      {
        id: 'proj1',
        name: 'Website Redesign',
        deadline: '2025-10-15',
        ownerId: 'user1',
        owner: {
          id: 'user1',
          username: 'johndoe'
        },
        members: [
          {
            id: 'member1',
            userId: 'user1',
            projectId: 'proj1',
            user: { id: 'user1', username: 'johndoe' }
          },
          {
            id: 'member2',
            userId: 'user2',
            projectId: 'proj1',
            user: { id: 'user2', username: 'jane_dev' }
          }
        ],
        tasks: [
          {
            id: 'task1',
            title: 'Create mockups',
            description: 'Design new homepage mockups',
            status: 'DONE',
            deadline: '2025-09-20',
            projectId: 'proj1',
            assigneeId: 'user2',
            assignee: { id: 'user2', username: 'jane_dev' }
          },
          {
            id: 'task2',
            title: 'Implement responsive design',
            description: 'Make the website mobile-friendly',
            status: 'IN_PROGRESS',
            deadline: '2025-10-10',
            projectId: 'proj1',
            assigneeId: 'user1',
            assignee: { id: 'user1', username: 'johndoe' }
          },
          {
            id: 'task3',
            title: 'Write content',
            description: 'Create copy for all pages',
            status: 'TODO',
            projectId: 'proj1'
          }
        ]
      },
      {
        id: 'proj2',
        name: 'Mobile App Development',
        deadline: '2025-12-01',
        ownerId: 'user1',
        owner: {
          id: 'user1',
          username: 'johndoe'
        },
        members: [
          {
            id: 'member3',
            userId: 'user1',
            projectId: 'proj2',
            user: { id: 'user1', username: 'johndoe' }
          }
        ],
        tasks: [
          {
            id: 'task4',
            title: 'Setup project structure',
            description: 'Initialize React Native project',
            status: 'TODO',
            projectId: 'proj2'
          }
        ]
      }
    ];
    
    setProjects(sampleProjects);
  }, []);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      setError('Please enter a project name');
      return;
    }

    try {
      setError(null);
      const project: Project = {
        id: generateId(),
        name: newProject.name,
        deadline: newProject.deadline || undefined,
        ownerId: session.user.id,
        owner: {
          id: session.user.id,
          username: session.user.name?.toLowerCase().replace(' ', '') || 'user'
        },
        members: [
          {
            id: generateId(),
            userId: session.user.id,
            projectId: generateId(),
            user: {
              id: session.user.id,
              username: session.user.name?.toLowerCase().replace(' ', '') || 'user'
            }
          }
        ],
        tasks: []
      };

      setProjects(prev => [...prev, project]);
      setNewProject({ name: '', deadline: '' });
      setShowCreateProject(false);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setProjects(prev => prev.filter(p => p.id !== projectId));
    setShowProjectSettings(false);
    setSelectedProject(null);
  };

  const handleAddMember = () => {
    if (!newMember.username.trim() || !selectedProject) {
      setError('Please enter a username');
      return;
    }

    try {
      setError(null);
      const member: ProjectMember = {
        id: generateId(),
        userId: generateId(),
        projectId: selectedProject.id,
        user: {
          id: generateId(),
          username: newMember.username.trim()
        }
      };

      setProjects(prev => prev.map(project =>
        project.id === selectedProject.id
          ? { ...project, members: [...project.members, member] }
          : project
      ));
      setNewMember({ username: '' });
      setShowAddMember(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setProjects(prev => prev.map(project => ({
      ...project,
      members: project.members.filter(m => m.id !== memberId)
    })));
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !selectedProject) {
      setError('Please enter a task title');
      return;
    }

    try {
      setError(null);
      let assignee = null;
      
      if (newTask.assigneeUsername.trim()) {
        // Find assignee in project members
        const member = selectedProject.members.find(m => 
          m.user.username.toLowerCase() === newTask.assigneeUsername.trim().toLowerCase()
        );
        if (member) {
          assignee = {
            id: member.userId,
            username: member.user.username
          };
        }
      }

      const task: Task = {
        id: generateId(),
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        status: 'TODO',
        deadline: newTask.deadline || undefined,
        projectId: selectedProject.id,
      };

      setProjects(prev => prev.map(project =>
        project.id === selectedProject.id
          ? { ...project, tasks: [...project.tasks, task] }
          : project
      ));
      setNewTask({ 
        title: '', 
        description: '', 
        deadline: '', 
        assigneeUsername: ''
      });
      setShowCreateTask(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setProjects(prev => prev.map(project => ({
      ...project,
      tasks: project.tasks.filter(t => t.id !== taskId)
    })));
  };

  const updateTaskStatus = (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    setProjects(prev => prev.map(project => ({
      ...project,
      tasks: project.tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    })));
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.status === 'DONE').length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <Clock className="w-3 h-3" />;
      case 'IN_PROGRESS': return <PlayCircle className="w-3 h-3" />;
      case 'DONE': return <CheckCircle2 className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'text-red-600';
    if (days <= 7) return 'text-orange-600';
    return 'text-green-600';
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'TODO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'DONE';
      case 'DONE': return 'TODO';
      default: return 'TODO';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (!project?.name) return false;

    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = () => {
      switch (filterStatus) {
        case 'active':
          return getTaskProgress(project.tasks || []) < 100;
        case 'completed':
          return getTaskProgress(project.tasks || []) === 100;
        default:
          return true;
      }
    };

    return matchesSearch && matchesFilter();
  });

  const resetError = () => setError(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateProject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
              <button 
                onClick={() => alert('Logout functionality removed')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </div>
              <button
                onClick={resetError}
                className="text-red-700 hover:text-red-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce(
                    (acc, p) => acc + (p.tasks?.filter(t => t.status === 'DONE').length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PlayCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce(
                    (acc, p) => acc + (p.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const progress = getTaskProgress(project.tasks);
            const daysLeft = project.deadline ? getDaysUntilDeadline(project.deadline) : null;
            const isOwner = project.ownerId === session?.user?.id;
            
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                {/* Project Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        {isOwner && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Owner</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Owner: {project.owner?.username || 'Unknown'}</p>
                      
                      <div className="flex items-center mt-3 space-x-4">
                        {project.deadline && (
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            <span className={getDeadlineStatus(project.deadline)}>
                              {daysLeft !== null && (
                                daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1 text-gray-400" />
                          {project.members?.length || 0} members
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Actions */}
                    {isOwner && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectSettings(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-3 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Tasks ({project.tasks?.length || 0})</h4>
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        setShowCreateTask(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Task
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {project.tasks?.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded group">
                        <button
                          onClick={() => updateTaskStatus(task.id, getNextStatus(task.status) as any)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === 'DONE' 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 hover:border-gray-400 text-gray-400'
                          }`}
                        >
                          {getStatusIcon(task.status)}
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm ${task.status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-900'} truncate block`}>
                            {task.title}
                          </span>
                          {task.assignee && (
                            <p className="text-xs text-gray-500 truncate">Assigned to: {task.assignee.username}</p>
                          )}
                          {task.deadline && (
                            <p className={`text-xs ${getDeadlineStatus(task.deadline)} truncate`}>
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            {task.status.replace('_', ' ')}
                          </span>
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 rounded transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {(project.tasks?.length || 0) > 5 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        +{(project.tasks?.length || 0) - 5} more tasks
                      </p>
                    )}
                    {(project.tasks?.length || 0) === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">No tasks yet</p>
                    )}
                  </div>
                </div>

                {/* Members Section */}
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Team Members</h4>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowAddMember(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.members?.slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="group relative"
                      >
                        <div
                          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white cursor-pointer hover:bg-blue-600 transition-colors"
                          title={member.user.username}
                        >
                          {member.user.username.charAt(0).toUpperCase()}
                        </div>
                        {isOwner && member.userId !== project.ownerId && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(project.members?.length || 0) > 5 && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                        +{(project.members?.length || 0) - 5}
                      </div>
                    )}
                    {(project.members?.length || 0) === 0 && (
                      <p className="text-sm text-gray-500">No members yet</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first project'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateProject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Project</h3>
              <button
                onClick={() => setShowCreateProject(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateProject(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Project: {selectedProject.name}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
              <button
                onClick={() => {
                  setShowCreateTask(false);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Project: {selectedProject.name}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to (optional)
                </label>
                <input
                  type="text"
                  value={newTask.assigneeUsername}
                  onChange={(e) => setNewTask({ ...newTask, assigneeUsername: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  User must be a project member
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateTask(false);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Settings Modal */}
      {showProjectSettings && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Settings</h3>
              <button
                onClick={() => {
                  setShowProjectSettings(false);
                  setSelectedProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedProject.name}</h4>
                <p className="text-sm text-gray-600">
                  Created by: {selectedProject.owner?.username || 'Unknown'}
                </p>
                {selectedProject.deadline && (
                  <p className="text-sm text-gray-600">
                    Deadline: {new Date(selectedProject.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Team Members ({selectedProject.members?.length || 0})</h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedProject.members?.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {member.user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-900">{member.user.username}</span>
                        {member.userId === selectedProject.ownerId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Owner</span>
                        )}
                      </div>
                      {member.userId !== selectedProject.ownerId && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {(selectedProject.members?.length || 0) === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">No members yet</p>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Tasks ({selectedProject.tasks?.length || 0})</h5>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProject.tasks?.filter(t => t.status === 'TODO').length || 0}
                    </p>
                    <p className="text-xs text-gray-600">To Do</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-sm font-medium text-blue-900">
                      {selectedProject.tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0}
                    </p>
                    <p className="text-xs text-blue-600">In Progress</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-sm font-medium text-green-900">
                      {selectedProject.tasks?.filter(t => t.status === 'DONE').length || 0}
                    </p>
                    <p className="text-xs text-green-600">Done</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Project
              </button>
              <button
                onClick={() => {
                  setShowProjectSettings(false);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
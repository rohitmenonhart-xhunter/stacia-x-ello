import React, { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import { Project, Update } from '../types';
import { FolderPlus, MessageSquarePlus, Clock, CheckCircle, FolderKanban, X, Loader2, Building2 } from 'lucide-react';

const Projects: React.FC = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // New project form state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState<'queue' | 'in-progress' | 'completed'>('queue');
  
  // New update form state
  const [newUpdateContent, setNewUpdateContent] = useState('');

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const updatesRef = ref(db, 'updates');
    
    const projectsUnsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProjects(projectsList);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });
    
    const updatesUnsubscribe = onValue(updatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setUpdates(updatesList);
      } else {
        setUpdates([]);
      }
    });

    return () => {
      projectsUnsubscribe();
      updatesUnsubscribe();
    };
  }, []);

  const handleAddProject = () => {
    if (!currentUser || !newProjectTitle.trim()) return;
    
    const newProject: Omit<Project, 'id'> = {
      title: newProjectTitle,
      description: newProjectDescription,
      status: newProjectStatus,
      createdAt: Date.now(),
      createdBy: currentUser.id,
      company: currentUser.company
    };
    
    const projectsRef = ref(db, 'projects');
    const newProjectRef = push(projectsRef);
    set(newProjectRef, newProject)
      .then(() => {
        setNewProjectTitle('');
        setNewProjectDescription('');
        setNewProjectStatus('queue');
        setShowAddProject(false);
      })
      .catch(error => {
        console.error("Error adding project: ", error);
      });
  };

  const handleAddUpdate = () => {
    if (!currentUser || !selectedProject || !newUpdateContent.trim()) return;
    
    const newUpdate: Omit<Update, 'id'> = {
      projectId: selectedProject.id,
      content: newUpdateContent,
      createdAt: Date.now(),
      createdBy: currentUser.id,
      company: currentUser.company
    };
    
    const updatesRef = ref(db, 'updates');
    const newUpdateRef = push(updatesRef);
    set(newUpdateRef, newUpdate)
      .then(() => {
        setNewUpdateContent('');
        setShowAddUpdate(false);
      })
      .catch(error => {
        console.error("Error adding update: ", error);
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queue':
        return <Clock className="h-5 w-5 text-primary-500" />;
      case 'in-progress':
        return <FolderKanban className="h-5 w-5 text-amber-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'queue':
        return 'bg-primary-50 text-primary-700 border-primary-200';
      case 'in-progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-secondary-50 text-secondary-700 border-secondary-200';
    }
  };

  const getCompanyStyles = (company: string) => {
    return company === 'ello'
      ? 'bg-violet-50 text-violet-700 border-violet-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  const getProjectUpdates = (projectId: string) => {
    return updates
      .filter(update => update.projectId === projectId)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 animate-slide-in">
        <h1 className="text-3xl font-bold text-secondary-900 flex items-center">
          <FolderKanban className="h-8 w-8 mr-3 text-primary-600" />
          Projects
        </h1>
        <button
          onClick={() => setShowAddProject(true)}
          className="btn btn-primary inline-flex items-center transform hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
        >
          <FolderPlus className="h-5 w-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="card divide-y divide-secondary-200 animate-slide-in" style={{ animationDelay: '100ms' }}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div 
              key={project.id} 
              className="p-6 animate-slide-in hover:bg-secondary-50 transition-colors duration-200"
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(project.status)}
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900">{project.title}</h3>
                    <p className="text-secondary-500 mt-1">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCompanyStyles(project.company)}`}>
                    <Building2 className="h-3 w-3 mr-1" />
                    {project.company === 'ello' ? 'Ello.one' : 'Stacia Corp'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(project.status)}`}>
                    {project.status === 'queue' 
                      ? 'Queue' 
                      : project.status === 'in-progress' 
                      ? 'In Progress' 
                      : 'Completed'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-secondary-500">
                  Created on {new Date(project.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowAddUpdate(true);
                  }}
                  className="btn btn-secondary inline-flex items-center py-1.5"
                >
                  <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                  Add Update
                </button>
              </div>
              
              {/* Project Updates */}
              {getProjectUpdates(project.id).length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">Updates</h4>
                  {getProjectUpdates(project.id).map(update => (
                    <div 
                      key={update.id} 
                      className="bg-secondary-50 p-4 rounded-lg border border-secondary-200"
                    >
                      <p className="text-secondary-700">{update.content}</p>
                      <div className="mt-2 flex justify-between items-center text-xs text-secondary-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${getCompanyStyles(update.company)}`}>
                          {update.company === 'ello' ? 'Ello.one' : 'Stacia Corp'}
                        </span>
                        <span>{new Date(update.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <FolderPlus className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600 text-lg">No projects found</p>
            <p className="text-secondary-500 mt-1">Start by adding a new project</p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-secondary-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slide-in">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowAddProject(false)}
                  className="text-secondary-400 hover:text-secondary-500 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-6" id="modal-title">
                      Add New Project
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          className="input"
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={newProjectDescription}
                          onChange={(e) => setNewProjectDescription(e.target.value)}
                          rows={3}
                          className="input"
                          placeholder="Enter project description"
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          value={newProjectStatus}
                          onChange={(e) => setNewProjectStatus(e.target.value as 'queue' | 'in-progress' | 'completed')}
                          className="input"
                        >
                          <option value="queue">Queue</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="btn btn-primary w-full sm:w-auto sm:ml-3"
                >
                  Add Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Update Modal */}
      {showAddUpdate && selectedProject && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-secondary-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-slide-in">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowAddUpdate(false)}
                  className="text-secondary-400 hover:text-secondary-500 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2" id="modal-title">
                      Add Update
                    </h3>
                    <p className="text-secondary-500 mb-6">
                      Adding update for project: {selectedProject.title}
                    </p>
                    <div>
                      <label htmlFor="update" className="block text-sm font-medium text-secondary-700 mb-1">
                        Update Content
                      </label>
                      <textarea
                        id="update"
                        value={newUpdateContent}
                        onChange={(e) => setNewUpdateContent(e.target.value)}
                        rows={4}
                        className="input"
                        placeholder="Enter your update..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddUpdate}
                  className="btn btn-primary w-full sm:w-auto sm:ml-3"
                >
                  Add Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUpdate(false)}
                  className="btn btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
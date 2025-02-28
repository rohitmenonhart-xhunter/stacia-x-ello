import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth/AuthContext';
import { Project } from '../types';
import { BarChart3, FolderKanban, Clock, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const StatusCard = ({ icon: Icon, title, count, description, className }: {
  icon: React.ElementType;
  title: string;
  count: number;
  description: string;
  className: string;
}) => (
  <div className="card hover:shadow-lg transition-shadow duration-300 animate-fade-in">
    <div className={`flex items-center p-4 ${className} rounded-lg mb-4`}>
      <Icon className="h-6 w-6 mr-3" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="px-4 pb-4">
      <div className="text-3xl font-bold mb-1">{count}</div>
      <p className="text-sm text-secondary-500">{description}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    
    const unsubscribe = onValue(projectsRef, (snapshot) => {
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

    return () => unsubscribe();
  }, []);

  const queuedProjects = projects.filter(p => p.status === 'queue');
  const inProgressProjects = projects.filter(p => p.status === 'in-progress');
  const completedProjects = projects.filter(p => p.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 animate-slide-in">
        <h1 className="text-3xl font-bold text-secondary-900 flex items-center mb-2">
          <BarChart3 className="h-8 w-8 mr-3 text-primary-600" />
          Dashboard Overview
        </h1>
        <p className="text-lg text-secondary-600">
          Welcome back, <span className="font-medium text-secondary-900">{currentUser?.name}</span>! Here's your project overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard
          icon={Clock}
          title="Queue"
          count={queuedProjects.length}
          description="Projects waiting to start"
          className="text-primary-600 bg-primary-50"
        />
        <StatusCard
          icon={FolderKanban}
          title="In Progress"
          count={inProgressProjects.length}
          description="Projects currently active"
          className="text-amber-600 bg-amber-50"
        />
        <StatusCard
          icon={CheckCircle}
          title="Completed"
          count={completedProjects.length}
          description="Projects successfully delivered"
          className="text-emerald-600 bg-emerald-50"
        />
      </div>

      <div className="card animate-slide-in" style={{ animationDelay: '200ms' }}>
        <div className="px-6 py-5 border-b border-secondary-200">
          <h3 className="text-xl font-semibold text-secondary-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-secondary-200">
          {projects.length > 0 ? (
            projects
              .sort((a, b) => b.createdAt - a.createdAt)
              .slice(0, 5)
              .map((project, index) => (
                <div 
                  key={project.id} 
                  className="px-6 py-4 hover:bg-secondary-50 transition-colors duration-200 animate-slide-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600 transition-colors duration-200">
                        {project.title}
                      </h4>
                      <p className="text-sm text-secondary-500 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(project.status)}`}>
                        {project.status === 'queue' 
                          ? 'Queue' 
                          : project.status === 'in-progress' 
                          ? 'In Progress' 
                          : 'Completed'}
                      </span>
                      <p className="text-xs text-secondary-500 mt-2">
                        {new Date(project.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-secondary-400 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-secondary-500 text-sm">No projects found. Start by adding a new project.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
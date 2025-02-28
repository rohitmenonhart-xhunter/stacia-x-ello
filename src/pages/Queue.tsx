import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebase';
import { Project } from '../types';
import { Clock, ArrowRightCircle, CheckCircle, Building2, ArrowLeftCircle, Loader2 } from 'lucide-react';

const ProjectCard = ({ 
  project, 
  onMoveForward, 
  onMoveBack, 
  showBackButton = true, 
  showForwardButton = true 
}: { 
  project: Project;
  onMoveForward?: () => void;
  onMoveBack?: () => void;
  showBackButton?: boolean;
  showForwardButton?: boolean;
}) => {
  const getCompanyStyles = (company: string) => {
    return company === 'ello'
      ? 'bg-violet-50 text-violet-700 border-violet-200'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-secondary-200 hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-secondary-900 font-medium truncate">{project.title}</h4>
          <p className="text-sm text-secondary-500 mt-1">
            {new Date(project.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-secondary-600 mt-2 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex items-start space-x-2">
          {showBackButton && onMoveBack && (
            <button
              onClick={onMoveBack}
              className="p-1.5 rounded-full text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
              title="Move Back"
            >
              <ArrowLeftCircle className="h-5 w-5" />
            </button>
          )}
          {showForwardButton && onMoveForward && (
            <button
              onClick={onMoveForward}
              className="p-1.5 rounded-full text-primary-500 hover:text-primary-700 hover:bg-primary-100 transition-colors duration-200"
              title="Move Forward"
            >
              <ArrowRightCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCompanyStyles(project.company)}`}>
          <Building2 className="h-3 w-3 mr-1" />
          {project.company === 'ello' ? 'Ello.one' : 'Stacia Corp'}
        </span>
      </div>
    </div>
  );
};

const Queue: React.FC = () => {
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

  const updateProjectStatus = (projectId: string, newStatus: 'queue' | 'in-progress' | 'completed') => {
    const projectRef = ref(db, `projects/${projectId}`);
    update(projectRef, { status: newStatus })
      .catch(error => {
        console.error("Error updating project status: ", error);
      });
  };

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

  const StatusColumn = ({ 
    title, 
    icon: Icon, 
    count, 
    projects, 
    colorClass,
    emptyMessage,
    onMoveForward,
    onMoveBack,
    showBackButton = true,
    showForwardButton = true
  }: {
    title: string;
    icon: React.ElementType;
    count: number;
    projects: Project[];
    colorClass: string;
    emptyMessage: string;
    onMoveForward?: (id: string) => void;
    onMoveBack?: (id: string) => void;
    showBackButton?: boolean;
    showForwardButton?: boolean;
  }) => (
    <div className="card overflow-hidden animate-fade-in">
      <div className={`px-4 py-4 border-b border-secondary-200 ${colorClass} flex items-center`}>
        <Icon className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-medium text-secondary-900">{title}</h3>
        <span className={`ml-2 ${colorClass} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
          {count}
        </span>
      </div>
      <div className="divide-y divide-secondary-200 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {projects.length > 0 ? (
          <div className="space-y-3 p-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onMoveForward={onMoveForward ? () => onMoveForward(project.id) : undefined}
                onMoveBack={onMoveBack ? () => onMoveBack(project.id) : undefined}
                showBackButton={showBackButton}
                showForwardButton={showForwardButton}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <Icon className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
            <p className="text-secondary-500 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 animate-slide-in">
        <h1 className="text-3xl font-bold text-secondary-900 flex items-center mb-2">
          <Clock className="h-8 w-8 mr-3 text-primary-600" />
          Project Queue
        </h1>
        <p className="text-lg text-secondary-600">
          Manage project statuses and track progress through the workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusColumn
          title="Queue"
          icon={Clock}
          count={queuedProjects.length}
          projects={queuedProjects}
          colorClass="text-primary-600 bg-primary-50"
          emptyMessage="No projects in queue"
          onMoveForward={(id) => updateProjectStatus(id, 'in-progress')}
          showBackButton={false}
        />
        <StatusColumn
          title="In Progress"
          icon={ArrowRightCircle}
          count={inProgressProjects.length}
          projects={inProgressProjects}
          colorClass="text-amber-600 bg-amber-50"
          emptyMessage="No projects in progress"
          onMoveForward={(id) => updateProjectStatus(id, 'completed')}
          onMoveBack={(id) => updateProjectStatus(id, 'queue')}
        />
        <StatusColumn
          title="Completed"
          icon={CheckCircle}
          count={completedProjects.length}
          projects={completedProjects}
          colorClass="text-emerald-600 bg-emerald-50"
          emptyMessage="No completed projects"
          onMoveBack={(id) => updateProjectStatus(id, 'in-progress')}
          showForwardButton={false}
        />
      </div>
    </div>
  );
};

export default Queue;
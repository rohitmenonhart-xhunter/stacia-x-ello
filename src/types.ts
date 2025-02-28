export interface User {
  id: string;
  username: string;
  company: 'ello' | 'stacia';
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'queue' | 'in-progress' | 'completed';
  createdAt: number;
  createdBy: string;
  company: 'ello' | 'stacia';
}

export interface Update {
  id: string;
  projectId: string;
  content: string;
  createdAt: number;
  createdBy: string;
  company: 'ello' | 'stacia';
}
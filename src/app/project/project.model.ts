import { ObjectId } from 'bson';

export interface Project {
  _id: ObjectId;
  title: string;
  description: string;
  language: string;
  code: string;
  owner: ObjectId;
  createdAt: Date;
}

export interface ProjectResponse{
  project: Project,
  projects: Project[];
  totalProjects: number;
  _id: ObjectId;
  title: string;
  description: string;
  language: string;
  code: string;
  owner: ObjectId;
  createdAt: Date;
}
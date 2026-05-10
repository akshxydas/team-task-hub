export const TEAM_MEMBERS = [
  "Akshay",
  "MKV",
  "PKV",
  "Akash",
  "Arun",
] as const;

export type TeamMember = (typeof TEAM_MEMBERS)[number];

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

export type ActivityAction =
  | "created"
  | "updated"
  | "completed"
  | "reopened"
  | "commented"
  | "deleted";

export interface Activity {
  id: string;
  action: ActivityAction;
  user: string;
  timestamp: number;
  detail?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate?: string; // ISO date
  assignedTo: string;
  completed: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  comments: Comment[];
  activity: Activity[];
}

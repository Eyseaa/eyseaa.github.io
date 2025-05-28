export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum TaskCategory {
  BRAND = 'brand',
  PERSONAL = 'personal',
  GYM = 'gym',
  CONTENT = 'content',
  UNCATEGORIZED = 'uncategorized',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  dueTime?: string; // HH:MM format
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  tags?: string[];
  subtasks?: SubTask[];
  notes?: string;
  addToCalendar?: boolean;
  createdAt: string; // ISO string
  recurrence?: {
    type: RecurrenceType;
    interval?: number; // For custom recurrence (every X days/weeks/months)
    endDate?: string; // Optional end date for recurring tasks
  };
  reminder?: {
    enabled: boolean;
    time?: string; // ISO string for when to send reminder
    notified?: boolean; // Whether notification has been sent
  };
}
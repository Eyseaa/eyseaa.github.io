import React from 'react';
import { addToast } from '@heroui/react';
import { Task, TaskPriority, TaskStatus, TaskCategory, RecurrenceType } from '../types/task';
import { generateSampleTasks } from '../data/sample-tasks';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
  toggleTaskStatus: (id: string) => void;
  getFilteredTasks: (filter: 'today' | 'upcoming' | 'completed' | 'all' | 'priority') => Task[];
  getTasksByCategory: (category: TaskCategory | 'all') => Task[];
  createRecurringTask: (completedTask: Task) => void;
  checkReminders: () => void;
}

export const TaskContext = React.createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  getTaskById: () => undefined,
  toggleTaskStatus: () => {},
  getFilteredTasks: () => [],
  getTasksByCategory: () => [],
  createRecurringTask: () => {},
  checkReminders: () => {},
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : generateSampleTasks();
  });

  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Check for reminders periodically
  React.useEffect(() => {
    const checkInterval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: TaskStatus.PENDING,
    };
    
    setTasks((prev) => [...prev, newTask]);
    
    addToast({
      title: "Task created",
      description: `"${task.title}" has been added to your tasks`,
      color: "success",
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
    
    addToast({
      title: "Task updated",
      description: "Your changes have been saved",
      color: "primary",
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    
    setTasks((prev) => prev.filter((task) => task.id !== id));
    
    if (taskToDelete) {
      addToast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed`,
        color: "danger",
      });
    }
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const newStatus = task.status === TaskStatus.COMPLETED 
            ? TaskStatus.PENDING 
            : TaskStatus.COMPLETED;
          
          // If task is being marked as completed and it's recurring, create next occurrence
          if (newStatus === TaskStatus.COMPLETED && task.recurrence && task.recurrence.type !== RecurrenceType.NONE) {
            setTimeout(() => createRecurringTask(task), 500);
          }
          
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };
  
  // Add method to create next occurrence of a recurring task
  const createRecurringTask = (completedTask: Task) => {
    if (!completedTask.recurrence || completedTask.recurrence.type === RecurrenceType.NONE) {
      return;
    }
    
    // Calculate next due date based on recurrence type
    const currentDueDate = new Date(completedTask.dueDate);
    let nextDueDate = new Date(currentDueDate);
    
    switch (completedTask.recurrence.type) {
      case RecurrenceType.DAILY:
        nextDueDate.setDate(currentDueDate.getDate() + 1);
        break;
      case RecurrenceType.WEEKLY:
        nextDueDate.setDate(currentDueDate.getDate() + 7);
        break;
      case RecurrenceType.MONTHLY:
        nextDueDate.setMonth(currentDueDate.getMonth() + 1);
        break;
      case RecurrenceType.CUSTOM:
        const interval = completedTask.recurrence.interval || 1;
        nextDueDate.setDate(currentDueDate.getDate() + interval);
        break;
    }
    
    // Check if we've reached the end date
    if (completedTask.recurrence.endDate) {
      const endDate = new Date(completedTask.recurrence.endDate);
      if (nextDueDate > endDate) {
        return; // Don't create a new task if we've passed the end date
      }
    }
    
    // Create the new recurring task
    const newTask: Omit<Task, 'id' | 'createdAt' | 'status'> = {
      title: completedTask.title,
      description: completedTask.description,
      dueDate: nextDueDate.toISOString().split('T')[0],
      dueTime: completedTask.dueTime,
      priority: completedTask.priority,
      category: completedTask.category,
      tags: completedTask.tags,
      addToCalendar: completedTask.addToCalendar,
      recurrence: completedTask.recurrence,
      reminder: completedTask.reminder ? {
        ...completedTask.reminder,
        notified: false // Reset notification status
      } : undefined,
    };
    
    addTask(newTask);
    
    addToast({
      title: "Recurring task created",
      description: `Next occurrence of "${completedTask.title}" has been scheduled`,
      color: "primary",
    });
  };
  
  // Add method to check for due reminders
  const checkReminders = () => {
    const now = new Date();
    
    setTasks((prev) => 
      prev.map((task) => {
        // Skip if task is completed, has no reminder, reminder is disabled, or already notified
        if (
          task.status === TaskStatus.COMPLETED || 
          !task.reminder || 
          !task.reminder.enabled || 
          task.reminder.notified ||
          !task.reminder.time
        ) {
          return task;
        }
        
        const reminderTime = new Date(task.reminder.time);
        
        // If it's time for the reminder
        if (now >= reminderTime) {
          // Show notification
          addToast({
            title: "Task Reminder",
            description: `"${task.title}" is due soon`,
            color: "warning",
          });
          
          // Update task to mark reminder as notified
          return {
            ...task,
            reminder: {
              ...task.reminder,
              notified: true
            }
          };
        }
        
        return task;
      })
    );
  };

  const getFilteredTasks = (filter: 'today' | 'upcoming' | 'completed' | 'all' | 'priority') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const upcoming = new Date(today);
    upcoming.setDate(upcoming.getDate() + 7);
    
    switch (filter) {
      case 'today':
        return tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime() && task.status !== TaskStatus.COMPLETED;
        });
      
      case 'upcoming':
        return tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate > today && dueDate <= upcoming && task.status !== TaskStatus.COMPLETED;
        });
      
      case 'completed':
        return tasks.filter(task => task.status === TaskStatus.COMPLETED);
      
      case 'priority':
        return tasks
          .filter(task => task.status !== TaskStatus.COMPLETED)
          .sort((a, b) => {
            const priorityOrder = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
      
      case 'all':
      default:
        return tasks;
    }
  };

  const getTasksByCategory = (category: TaskCategory | 'all') => {
    if (category === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.category === category);
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    toggleTaskStatus,
    getFilteredTasks,
    getTasksByCategory,
    createRecurringTask,
    checkReminders,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => React.useContext(TaskContext);
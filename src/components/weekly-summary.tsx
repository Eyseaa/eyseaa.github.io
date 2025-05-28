import React from 'react';
import { Card, CardBody, Progress, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/task-context';
import { Task, TaskStatus, TaskCategory } from '../types/task';

export const WeeklySummary: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Get start and end of current week
  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
  };
  
  // Filter tasks for current week
  const getWeeklyTasks = () => {
    const { startOfWeek, endOfWeek } = getWeekDates();
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  };
  
  const weeklyTasks = getWeeklyTasks();
  const completedTasks = weeklyTasks.filter(task => task.status === TaskStatus.COMPLETED);
  const completionRate = weeklyTasks.length > 0 
    ? Math.round((completedTasks.length / weeklyTasks.length) * 100) 
    : 0;
  
  // Group tasks by category
  const tasksByCategory = weeklyTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
  
  // Format date range for display
  const formatDateRange = () => {
    const { startOfWeek, endOfWeek } = getWeekDates();
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = startOfWeek.toLocaleDateString('en-US', options);
    const endStr = endOfWeek.toLocaleDateString('en-US', options);
    
    return `${startStr} - ${endStr}`;
  };
  
  // Category icon mapping
  const categoryIcons = {
    [TaskCategory.BRAND]: "lucide:shopping-bag",
    [TaskCategory.PERSONAL]: "lucide:user",
    [TaskCategory.GYM]: "lucide:dumbbell",
    [TaskCategory.CONTENT]: "lucide:image",
    [TaskCategory.UNCATEGORIZED]: "lucide:folder",
  };
  
  const categoryColors = {
    [TaskCategory.BRAND]: "primary",
    [TaskCategory.PERSONAL]: "secondary",
    [TaskCategory.GYM]: "success",
    [TaskCategory.CONTENT]: "warning",
    [TaskCategory.UNCATEGORIZED]: "default",
  } as const;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card shadow="sm">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Icon icon="lucide:bar-chart-2" className="mr-2" />
              Weekly Summary
            </h2>
            <span className="text-default-500">{formatDateRange()}</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-default-600">Completion Rate</span>
                <span className="font-semibold">{completionRate}%</span>
              </div>
              <Progress 
                value={completionRate} 
                color="primary"
                className="h-2"
              />
              <div className="flex justify-between mt-2 text-small text-default-500">
                <span>{completedTasks.length} completed</span>
                <span>{weeklyTasks.length} total</span>
              </div>
            </div>
            
            <Divider />
            
            <div>
              <h3 className="text-medium font-semibold mb-3">Tasks by Category</h3>
              
              {Object.keys(tasksByCategory).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
                    const completedCount = categoryTasks.filter(
                      task => task.status === TaskStatus.COMPLETED
                    ).length;
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Icon 
                              icon={categoryIcons[category as TaskCategory]} 
                              className={`text-${categoryColors[category as TaskCategory]} mr-2`}
                              width={16}
                              height={16}
                            />
                            <span className="capitalize">{category}</span>
                          </div>
                          <span className="text-small text-default-500">
                            {completedCount}/{categoryTasks.length}
                          </span>
                        </div>
                        <Progress 
                          value={(completedCount / categoryTasks.length) * 100} 
                          color={categoryColors[category as TaskCategory]}
                          size="sm"
                          className="h-1"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-default-500 text-center py-4">
                  No tasks scheduled for this week
                </p>
              )}
            </div>
            
            {completedTasks.length > 0 && (
              <>
                <Divider />
                
                <div>
                  <h3 className="text-medium font-semibold mb-3">Recently Completed</h3>
                  <div className="space-y-2">
                    {completedTasks.slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center">
                        <Icon 
                          icon="lucide:check-circle" 
                          className="text-success mr-2"
                          width={16}
                          height={16}
                        />
                        <span className="text-default-600 line-clamp-1">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Checkbox, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Task, TaskPriority, TaskStatus, TaskCategory, RecurrenceType } from '../types/task';
import { useTaskContext } from '../context/task-context';

interface TaskCardProps {
  task: Task;
  showActions?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, showActions = true }) => {
  const { toggleTaskStatus } = useTaskContext();
  const isCompleted = task.status === TaskStatus.COMPLETED;
  
  const priorityColors = {
    [TaskPriority.LOW]: "success",
    [TaskPriority.MEDIUM]: "warning",
    [TaskPriority.HIGH]: "danger",
  } as const;
  
  const priorityIcons = {
    [TaskPriority.LOW]: "lucide:arrow-down",
    [TaskPriority.MEDIUM]: "lucide:minus",
    [TaskPriority.HIGH]: "lucide:arrow-up",
  };
  
  const categoryColors = {
    [TaskCategory.BRAND]: "primary",
    [TaskCategory.PERSONAL]: "secondary",
    [TaskCategory.GYM]: "success",
    [TaskCategory.CONTENT]: "warning",
    [TaskCategory.UNCATEGORIZED]: "default",
  } as const;
  
  const categoryIcons = {
    [TaskCategory.BRAND]: "lucide:shopping-bag",
    [TaskCategory.PERSONAL]: "lucide:user",
    [TaskCategory.GYM]: "lucide:dumbbell",
    [TaskCategory.CONTENT]: "lucide:image",
    [TaskCategory.UNCATEGORIZED]: "lucide:folder",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      <Card 
        className={`w-full ${isCompleted ? 'opacity-70' : ''}`}
        shadow="sm"
      >
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              isSelected={isCompleted}
              onValueChange={() => toggleTaskStatus(task.id)}
              size="md"
              color={priorityColors[task.priority]}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <Link to={`/tasks/${task.id}`} className="block">
                <h3 className={`text-medium font-semibold mb-1 ${isCompleted ? 'line-through text-default-400' : ''}`}>
                  {task.title}
                </h3>
              </Link>
              
              {task.description && (
                <p className="text-small text-default-500 mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center text-small text-default-500">
                  <Icon icon="lucide:calendar" className="mr-1" width={14} height={14} />
                  <span>{formatDate(task.dueDate)}</span>
                  {task.dueTime && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{formatTime(task.dueTime)}</span>
                    </>
                  )}
                </div>
                
                {/* Add recurrence indicator */}
                {task.recurrence && task.recurrence.type !== RecurrenceType.NONE && (
                  <Chip 
                    size="sm" 
                    startContent={<Icon icon="lucide:repeat" width={14} height={14} />}
                    variant="flat"
                    color="secondary"
                    className="text-tiny"
                  >
                    {task.recurrence.type}
                  </Chip>
                )}
                
                {/* Add reminder indicator */}
                {task.reminder && task.reminder.enabled && (
                  <Chip 
                    size="sm" 
                    startContent={<Icon icon="lucide:bell" width={14} height={14} />}
                    variant="flat"
                    color="secondary"
                    className="text-tiny"
                  >
                    reminder
                  </Chip>
                )}
                
                <Chip 
                  size="sm" 
                  startContent={<Icon icon={categoryIcons[task.category]} width={14} height={14} />}
                  variant="flat"
                  color={categoryColors[task.category]}
                  className="text-tiny"
                >
                  {task.category}
                </Chip>
                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag) => (
                      <Chip 
                        key={tag} 
                        size="sm" 
                        variant="flat" 
                        color="default"
                        className="text-tiny"
                      >
                        {tag}
                      </Chip>
                    ))}
                    {task.tags.length > 2 && (
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color="default"
                        className="text-tiny"
                      >
                        +{task.tags.length - 2}
                      </Chip>
                    )}
                  </div>
                )}
                
                <Chip 
                  size="sm" 
                  startContent={<Icon icon={priorityIcons[task.priority]} width={14} height={14} />}
                  variant="flat"
                  color={priorityColors[task.priority]}
                  className="ml-auto text-tiny"
                >
                  {task.priority}
                </Chip>
              </div>
              
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 text-tiny text-default-500">
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:list-checks" width={14} height={14} />
                    <span>
                      {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {showActions && (
              <Link to={`/tasks/${task.id}`} className="self-center">
                <Button 
                  isIconOnly 
                  variant="light" 
                  size="sm"
                  className="text-default-400"
                >
                  <Icon icon="lucide:chevron-right" width={18} height={18} />
                </Button>
              </Link>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
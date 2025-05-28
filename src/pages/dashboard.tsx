import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Divider, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/task-context';
import { useAuth } from '../context/auth-context';
import { TaskCard } from '../components/task-card';
import { AddTaskModal } from '../components/add-task-modal';
import { EmptyState } from '../components/empty-state';
import { TaskCategory } from '../types/task';
import { WeeklySummary } from '../components/weekly-summary';
import { FocusTimer } from '../components/focus-timer';

export const Dashboard: React.FC = () => {
  const { getFilteredTasks, getTasksByCategory } = useTaskContext();
  const { user } = useAuth();
  const history = useHistory();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = React.useState(false);
  
  const todayTasks = getFilteredTasks('today');
  const upcomingTasks = getFilteredTasks('upcoming');
  
  // Get tasks by category for category summary
  const brandTasks = getTasksByCategory(TaskCategory.BRAND).filter(task => task.status !== 'completed');
  const personalTasks = getTasksByCategory(TaskCategory.PERSONAL).filter(task => task.status !== 'completed');
  const gymTasks = getTasksByCategory(TaskCategory.GYM).filter(task => task.status !== 'completed');
  const contentTasks = getTasksByCategory(TaskCategory.CONTENT).filter(task => task.status !== 'completed');
  
  const userName = user?.name || "User"; // Use authenticated user's name
  
  // Category icon mapping
  const categoryIcons = {
    [TaskCategory.BRAND]: "lucide:shopping-bag",
    [TaskCategory.PERSONAL]: "lucide:user",
    [TaskCategory.GYM]: "lucide:dumbbell",
    [TaskCategory.CONTENT]: "lucide:image",
  };
  
  const categoryColors = {
    [TaskCategory.BRAND]: "primary",
    [TaskCategory.PERSONAL]: "secondary",
    [TaskCategory.GYM]: "success",
    [TaskCategory.CONTENT]: "warning",
  } as const;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold">
            What's on your mind, {userName}?
          </h1>
          <p className="text-default-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Add Focus Timer Button */}
          <Button 
            variant="flat"
            startContent={<Icon icon="lucide:clock" />}
            onPress={() => setIsFocusTimerOpen(true)}
          >
            Focus Timer
          </Button>
          
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => setIsAddModalOpen(true)}
          >
            New Task
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Add Weekly Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {/* Category Summary Section */}
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Icon icon="lucide:layers" className="mr-2" />
              Categories
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Brand Category Card */}
              <Card 
                shadow="sm" 
                isPressable 
                onPress={() => {
                  history.push('/tasks');
                  // We would ideally set the category filter here, but that would require lifting state up
                }}
                className="border-l-4 border-primary"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon={categoryIcons[TaskCategory.BRAND]} className="text-primary" width={20} height={20} />
                    <Chip size="sm" variant="flat" color={categoryColors[TaskCategory.BRAND]}>
                      {brandTasks.length}
                    </Chip>
                  </div>
                  <h3 className="text-medium font-semibold">Brand</h3>
                  <p className="text-tiny text-default-500">
                    {brandTasks.length === 0 
                      ? "No active tasks" 
                      : brandTasks.length === 1 
                        ? "1 active task" 
                        : `${brandTasks.length} active tasks`}
                  </p>
                </CardBody>
              </Card>
              
              {/* Personal Category Card */}
              <Card 
                shadow="sm" 
                isPressable 
                onPress={() => history.push('/tasks')}
                className="border-l-4 border-secondary"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon={categoryIcons[TaskCategory.PERSONAL]} className="text-secondary" width={20} height={20} />
                    <Chip size="sm" variant="flat" color={categoryColors[TaskCategory.PERSONAL]}>
                      {personalTasks.length}
                    </Chip>
                  </div>
                  <h3 className="text-medium font-semibold">Personal</h3>
                  <p className="text-tiny text-default-500">
                    {personalTasks.length === 0 
                      ? "No active tasks" 
                      : personalTasks.length === 1 
                        ? "1 active task" 
                        : `${personalTasks.length} active tasks`}
                  </p>
                </CardBody>
              </Card>
              
              {/* Gym Category Card */}
              <Card 
                shadow="sm" 
                isPressable 
                onPress={() => history.push('/tasks')}
                className="border-l-4 border-success"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon={categoryIcons[TaskCategory.GYM]} className="text-success" width={20} height={20} />
                    <Chip size="sm" variant="flat" color={categoryColors[TaskCategory.GYM]}>
                      {gymTasks.length}
                    </Chip>
                  </div>
                  <h3 className="text-medium font-semibold">Gym</h3>
                  <p className="text-tiny text-default-500">
                    {gymTasks.length === 0 
                      ? "No active tasks" 
                      : gymTasks.length === 1 
                        ? "1 active task" 
                        : `${gymTasks.length} active tasks`}
                  </p>
                </CardBody>
              </Card>
              
              {/* Content Category Card */}
              <Card 
                shadow="sm" 
                isPressable 
                onPress={() => history.push('/tasks')}
                className="border-l-4 border-warning"
              >
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon icon={categoryIcons[TaskCategory.CONTENT]} className="text-warning" width={20} height={20} />
                    <Chip size="sm" variant="flat" color={categoryColors[TaskCategory.CONTENT]}>
                      {contentTasks.length}
                    </Chip>
                  </div>
                  <h3 className="text-medium font-semibold">Content</h3>
                  <p className="text-tiny text-default-500">
                    {contentTasks.length === 0 
                      ? "No active tasks" 
                      : contentTasks.length === 1 
                        ? "1 active task" 
                        : `${contentTasks.length} active tasks`}
                  </p>
                </CardBody>
              </Card>
            </div>
            
            {/* Today's Tasks */}
            <Card shadow="sm" className="mb-6">
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Icon icon="lucide:calendar-check" className="mr-2" />
                  Today's Tasks
                </h2>
                
                {todayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {todayTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="lucide:check-circle"
                    title="All clear for today!"
                    description="You have no tasks scheduled for today. Would you like to create one?"
                    actionLabel="Add Task"
                    onAction={() => setIsAddModalOpen(true)}
                  />
                )}
              </CardBody>
            </Card>
          </div>
          
          <div>
            <WeeklySummary />
          </div>
        </motion.div>
        
        {/* Upcoming Tasks */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Icon icon="lucide:calendar-days" className="mr-2" />
              Upcoming Tasks
            </h2>
            
            <Button 
              variant="light" 
              color="primary"
              endContent={<Icon icon="lucide:chevron-right" />}
              onPress={() => history.push('/tasks')}
            >
              View All
            </Button>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card shadow="sm">
              <CardBody>
                <EmptyState
                  icon="lucide:calendar"
                  title="No upcoming tasks"
                  description="You're all caught up! Your schedule is clear for the upcoming week."
                  actionLabel="Plan Ahead"
                  onAction={() => setIsAddModalOpen(true)}
                />
              </CardBody>
            </Card>
          )}
        </motion.div>
      </motion.div>
      
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <FocusTimer isOpen={isFocusTimerOpen} onClose={() => setIsFocusTimerOpen(false)} />
    </div>
  );
};
import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '../context/task-context';
import { TaskCard } from '../components/task-card';
import { TaskFilter } from '../components/task-filter';
import { CategoryFilter } from '../components/category-filter';
import { AddTaskModal } from '../components/add-task-modal';
import { EmptyState } from '../components/empty-state';
import { TaskCategory } from '../types/task';

export const Tasks: React.FC = () => {
  const { getFilteredTasks, getTasksByCategory } = useTaskContext();
  const [activeFilter, setActiveFilter] = React.useState('today');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  
  const filteredTasks = React.useMemo(() => {
    const tasksByFilter = getFilteredTasks(activeFilter as any);
    
    if (activeCategory === 'all') {
      return tasksByFilter;
    }
    
    return tasksByFilter.filter(task => task.category === activeCategory);
  }, [getFilteredTasks, activeFilter, activeCategory]);
  
  const handleFilterChange = (key: React.Key) => {
    setActiveFilter(key.toString());
  };
  
  const handleCategoryChange = (key: React.Key) => {
    setActiveCategory(key.toString());
  };
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-semibold">Tasks</h1>
        
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={() => setIsAddModalOpen(true)}
        >
          New Task
        </Button>
      </motion.div>
      
      <div className="mb-4">
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </div>
      
      <div className="mb-6">
        <TaskFilter 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      <Card shadow="sm">
        <CardBody className="p-0">
          {filteredTasks.length > 0 ? (
            <AnimatePresence>
              <div className="divide-y divide-divider">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-2">
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <div className="p-6">
              <EmptyState
                icon={
                  activeFilter === 'completed' 
                    ? "lucide:check-circle" 
                    : "lucide:clipboard-list"
                }
                title={
                  activeFilter === 'completed' 
                    ? "No completed tasks" 
                    : "No tasks found"
                }
                description={
                  activeCategory !== 'all'
                    ? `No ${activeFilter} tasks in the ${activeCategory} category.`
                    : activeFilter === 'completed' 
                      ? "You haven't completed any tasks yet. Keep going!" 
                      : "There are no tasks matching your current filter. Try creating a new task."
                }
                actionLabel="Create Task"
                onAction={() => setIsAddModalOpen(true)}
              />
            </div>
          )}
        </CardBody>
      </Card>
      
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../context/task-context';
import { Task, TaskPriority } from '../types/task';
import { AddTaskModal } from '../components/add-task-modal';

export const Calendar: React.FC = () => {
  const { tasks } = useTaskContext();
  const history = useHistory();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'month' | 'week'>('month');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  
  const priorityColors = {
    [TaskPriority.LOW]: "bg-success-100 text-success-600 dark:bg-success-900 dark:text-success-200",
    [TaskPriority.MEDIUM]: "bg-warning-100 text-warning-600 dark:bg-warning-900 dark:text-warning-200",
    [TaskPriority.HIGH]: "bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-200",
  };
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        date: new Date(prevYear, prevMonth, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Add current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: 
          date.getDate() === today.getDate() && 
          date.getMonth() === today.getMonth() && 
          date.getFullYear() === today.getFullYear(),
      });
    }
    
    // Add next month days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  };
  
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const handleTaskClick = (taskId: string) => {
    history.push(`/tasks/${taskId}`);
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const renderMonthView = () => (
    <div>
      <div className="calendar-grid mb-1">
        {weekdays.map(day => (
          <div key={day} className="text-center py-2 text-small font-medium text-default-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const tasksForDay = getTasksForDate(day.date);
          
          return (
            <div 
              key={index}
              className={`
                calendar-day border border-divider
                ${!day.isCurrentMonth ? 'bg-default-50 dark:bg-default-100/10' : ''}
                ${day.isToday ? 'border-primary' : ''}
              `}
            >
              <div className="calendar-day-content">
                <div className={`
                  calendar-day-header
                  ${day.isToday ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-200' : ''}
                  ${!day.isCurrentMonth ? 'text-default-400' : ''}
                `}>
                  {day.date.getDate()}
                </div>
                
                <div className="calendar-day-tasks">
                  {tasksForDay.slice(0, 3).map(task => (
                    <div 
                      key={task.id}
                      className={`calendar-task cursor-pointer ${priorityColors[task.priority]}`}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {tasksForDay.length > 3 && (
                    <div className="calendar-task text-default-500 bg-default-100 dark:bg-default-200/20">
                      +{tasksForDay.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const renderWeekView = () => {
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    
    const today = new Date();
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const isToday = 
              date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth() && 
              date.getFullYear() === today.getFullYear();
            
            return (
              <div 
                key={index} 
                className={`text-center py-2 ${isToday ? 'bg-primary-100 dark:bg-primary-900 rounded-medium' : ''}`}
              >
                <div className="text-small font-medium">{weekdays[index]}</div>
                <div className={`text-xl ${isToday ? 'text-primary-600 dark:text-primary-300' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {weekDays.map((date, index) => {
            const tasksForDay = getTasksForDate(date);
            
            if (tasksForDay.length === 0) return null;
            
            return (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-16 text-small font-medium text-default-600">
                    {weekdays[index]}
                  </div>
                  <div className="flex-1 h-px bg-divider"></div>
                </div>
                
                <div className="pl-16">
                  <div className="space-y-2">
                    {tasksForDay.map(task => (
                      <div 
                        key={task.id}
                        className={`
                          p-2 rounded-medium cursor-pointer
                          ${priorityColors[task.priority]}
                        `}
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.dueTime && (
                          <div className="text-small">
                            {task.dueTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-semibold">Calendar</h1>
        
        <Button 
          color="primary" 
          startContent={<Icon icon="lucide:plus" />}
          onPress={() => setIsAddModalOpen(true)}
        >
          New Task
        </Button>
      </motion.div>
      
      <Card shadow="sm" className="mb-6">
        <CardBody className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button 
                isIconOnly 
                variant="flat" 
                size="sm"
                onPress={handlePrevMonth}
              >
                <Icon icon="lucide:chevron-left" />
              </Button>
              
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <Button 
                isIconOnly 
                variant="flat" 
                size="sm"
                onPress={handleNextMonth}
              >
                <Icon icon="lucide:chevron-right" />
              </Button>
            </div>
            
            <Tabs 
              aria-label="Calendar view options" 
              selectedKey={view}
              onSelectionChange={(key) => setView(key as 'month' | 'week')}
              size="sm"
              variant="light"
            >
              <Tab key="month" title="Month" />
              <Tab key="week" title="Week" />
            </Tabs>
          </div>
          
          {view === 'month' ? renderMonthView() : renderWeekView()}
        </CardBody>
      </Card>
      
      <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
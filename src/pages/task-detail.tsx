import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Button, 
  Card, 
  CardBody, 
  Input, 
  Textarea, 
  Select, 
  SelectItem, 
  Checkbox,
  Chip,
  Divider,
  DateInput,
  Accordion,
  AccordionItem,
  Switch
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { parseDate } from '@internationalized/date';
import { useTaskContext } from '../context/task-context';
import { Task, TaskPriority, TaskStatus, TaskCategory, RecurrenceType, SubTask } from '../types/task';
import { EmptyState } from '../components/empty-state';
import { FocusTimer } from '../components/focus-timer';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { getTaskById, updateTask, deleteTask, toggleTaskStatus } = useTaskContext();
  
  const task = getTaskById(id);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState<Task | null>(null);
  const [newSubtask, setNewSubtask] = React.useState('');
  const [newTag, setNewTag] = React.useState('');
  const [isFocusTimerOpen, setIsFocusTimerOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);
  
  if (!task || !editedTask) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Card shadow="sm">
          <CardBody>
            <EmptyState
              icon="lucide:alert-circle"
              title="Task not found"
              description="The task you're looking for doesn't exist or has been deleted."
              actionLabel="Go to Tasks"
              onAction={() => history.push('/tasks')}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
  
  const handleSave = () => {
    if (editedTask) {
      updateTask(id, editedTask);
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    deleteTask(id);
    history.push('/tasks');
  };
  
  const handleDateChange = (value: any) => {
    if (value && editedTask) {
      const jsDate = new Date(
        value.year,
        value.month - 1,
        value.day
      );
      
      setEditedTask({
        ...editedTask,
        dueDate: jsDate.toISOString().split('T')[0]
      });
    }
  };
  
  const handleAddSubtask = () => {
    if (!newSubtask.trim() || !editedTask) return;
    
    const newSubtaskObj: SubTask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };
    
    setEditedTask({
      ...editedTask,
      subtasks: [...(editedTask.subtasks || []), newSubtaskObj],
    });
    
    setNewSubtask('');
  };
  
  const handleToggleSubtask = (subtaskId: string) => {
    if (!editedTask || !editedTask.subtasks) return;
    
    const updatedSubtasks = editedTask.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );
    
    setEditedTask({
      ...editedTask,
      subtasks: updatedSubtasks,
    });
    
    if (!isEditing) {
      updateTask(id, {
        ...editedTask,
        subtasks: updatedSubtasks,
      });
    }
  };
  
  const handleRemoveSubtask = (subtaskId: string) => {
    if (!editedTask || !editedTask.subtasks) return;
    
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.filter(subtask => subtask.id !== subtaskId),
    });
  };
  
  const handleAddTag = () => {
    if (!newTag.trim() || !editedTask) return;
    
    const tags = [...(editedTask.tags || [])];
    
    if (!tags.includes(newTag.trim())) {
      tags.push(newTag.trim());
      
      setEditedTask({
        ...editedTask,
        tags,
      });
    }
    
    setNewTag('');
  };
  
  const handleRemoveTag = (tag: string) => {
    if (!editedTask || !editedTask.tags) return;
    
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags.filter(t => t !== tag),
    });
  };
  
  const handleRecurrenceTypeChange = (value: string) => {
    if (!editedTask) return;
    
    const recurrenceType = value as RecurrenceType;
    
    if (recurrenceType === RecurrenceType.NONE) {
      // Remove recurrence if set to none
      const { recurrence, ...rest } = editedTask;
      setEditedTask(rest as Task);
    } else {
      // Set or update recurrence
      setEditedTask({
        ...editedTask,
        recurrence: {
          type: recurrenceType,
          ...(editedTask.recurrence || {}),
        }
      });
    }
  };
  
  const handleRecurrenceIntervalChange = (value: string) => {
    if (!editedTask || !editedTask.recurrence) return;
    
    setEditedTask({
      ...editedTask,
      recurrence: {
        ...editedTask.recurrence,
        interval: parseInt(value) || 1,
      }
    });
  };
  
  const handleRecurrenceEndDateChange = (value: any) => {
    if (!editedTask || !editedTask.recurrence) return;
    
    if (value) {
      const jsDate = new Date(
        value.year,
        value.month - 1,
        value.day
      );
      
      setEditedTask({
        ...editedTask,
        recurrence: {
          ...editedTask.recurrence,
          endDate: jsDate.toISOString().split('T')[0],
        }
      });
    } else {
      // Remove end date
      const { endDate, ...restRecurrence } = editedTask.recurrence;
      setEditedTask({
        ...editedTask,
        recurrence: restRecurrence,
      });
    }
  };
  
  const handleReminderToggle = (enabled: boolean) => {
    if (!editedTask) return;
    
    if (!enabled) {
      // Remove reminder if disabled
      const { reminder, ...rest } = editedTask;
      setEditedTask(rest as Task);
    } else {
      // Set default reminder (3 hours before)
      const dueDateTime = editedTask.dueTime 
        ? new Date(`${editedTask.dueDate}T${editedTask.dueTime}`) 
        : new Date(`${editedTask.dueDate}T12:00:00`);
      
      const reminderTime = new Date(dueDateTime.getTime() - (3 * 60 * 60 * 1000));
      
      setEditedTask({
        ...editedTask,
        reminder: {
          enabled: true,
          time: reminderTime.toISOString(),
          notified: false,
        }
      });
    }
  };
  
  const handleReminderHoursChange = (value: string) => {
    if (!editedTask || !editedTask.reminder) return;
    
    const hours = parseInt(value) || 3;
    const dueDateTime = editedTask.dueTime 
      ? new Date(`${editedTask.dueDate}T${editedTask.dueTime}`) 
      : new Date(`${editedTask.dueDate}T12:00:00`);
    
    const reminderTime = new Date(dueDateTime.getTime() - (hours * 60 * 60 * 1000));
    
    setEditedTask({
      ...editedTask,
      reminder: {
        ...editedTask.reminder,
        time: reminderTime.toISOString(),
      }
    });
  };
  
  // Add category icons and colors
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="light" 
            startContent={<Icon icon="lucide:arrow-left" />}
            onPress={() => history.goBack()}
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="flat" 
                  color="default"
                  onPress={() => {
                    setIsEditing(false);
                    setEditedTask({ ...task });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary"
                  onPress={handleSave}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                {/* Add Focus Timer Button */}
                <Button 
                  variant="flat" 
                  color="primary"
                  startContent={<Icon icon="lucide:clock" />}
                  onPress={() => setIsFocusTimerOpen(true)}
                >
                  Focus Timer
                </Button>
                <Button 
                  variant="flat" 
                  color="danger"
                  startContent={<Icon icon="lucide:trash" />}
                  onPress={handleDelete}
                >
                  Delete
                </Button>
                <Button 
                  color="primary"
                  startContent={<Icon icon="lucide:edit" />}
                  onPress={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Card shadow="sm">
          <CardBody className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  isSelected={task.status === TaskStatus.COMPLETED}
                  onValueChange={() => toggleTaskStatus(id)}
                  size="lg"
                  color={priorityColors[task.priority]}
                />
                
                {isEditing ? (
                  <Input
                    value={editedTask.title}
                    onValueChange={(value) => setEditedTask({ ...editedTask, title: value })}
                    placeholder="Task title"
                    className="flex-1"
                  />
                ) : (
                  <h1 className={`text-2xl font-semibold flex-1 ${task.status === TaskStatus.COMPLETED ? 'line-through text-default-400' : ''}`}>
                    {task.title}
                  </h1>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Add category chip */}
                <Chip 
                  startContent={<Icon icon={categoryIcons[task.category]} width={16} height={16} />}
                  color={categoryColors[task.category]}
                >
                  {task.category}
                </Chip>
                
                <Chip 
                  startContent={<Icon icon={priorityIcons[task.priority]} width={16} height={16} />}
                  color={priorityColors[task.priority]}
                >
                  {task.priority} priority
                </Chip>
                
                {task.addToCalendar && (
                  <Chip 
                    startContent={<Icon icon="lucide:calendar" width={16} height={16} />}
                    variant="flat"
                    color="primary"
                  >
                    In Calendar
                  </Chip>
                )}
                
                {!isEditing && task.tags && task.tags.map(tag => (
                  <Chip 
                    key={tag} 
                    variant="flat"
                    color="default"
                  >
                    {tag}
                  </Chip>
                ))}
                
                {/* Add recurrence chip */}
                {task.recurrence && task.recurrence.type !== RecurrenceType.NONE && (
                  <Chip 
                    startContent={<Icon icon="lucide:repeat" width={16} height={16} />}
                    color="secondary"
                  >
                    {task.recurrence.type}
                    {task.recurrence.interval && task.recurrence.type === RecurrenceType.CUSTOM && 
                      ` (every ${task.recurrence.interval} days)`}
                  </Chip>
                )}
                
                {/* Add reminder chip */}
                {task.reminder && task.reminder.enabled && (
                  <Chip 
                    startContent={<Icon icon="lucide:bell" width={16} height={16} />}
                    color="secondary"
                  >
                    reminder
                  </Chip>
                )}
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-small text-default-500 mb-1">Due Date</p>
                    {isEditing ? (
                      <DateInput
                        value={parseDate(editedTask.dueDate)}
                        onChange={handleDateChange}
                      />
                    ) : (
                      <p className="font-medium">{formatDate(task.dueDate)}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-small text-default-500 mb-1">Due Time</p>
                    {isEditing ? (
                      <Input
                        type="time"
                        value={editedTask.dueTime || ''}
                        onValueChange={(value) => setEditedTask({ ...editedTask, dueTime: value })}
                      />
                    ) : (
                      <p className="font-medium">
                        {task.dueTime ? task.dueTime : 'No specific time'}
                      </p>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <>
                    {/* Add Category Select */}
                    <div>
                      <p className="text-small text-default-500 mb-1">Category</p>
                      <Select
                        selectedKeys={[editedTask.category]}
                        onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value as TaskCategory })}
                      >
                        <SelectItem 
                          key={TaskCategory.BRAND} 
                          startContent={<Icon icon={categoryIcons[TaskCategory.BRAND]} className="text-primary" />}
                        >
                          Brand
                        </SelectItem>
                        <SelectItem 
                          key={TaskCategory.PERSONAL} 
                          startContent={<Icon icon={categoryIcons[TaskCategory.PERSONAL]} className="text-secondary" />}
                        >
                          Personal
                        </SelectItem>
                        <SelectItem 
                          key={TaskCategory.GYM} 
                          startContent={<Icon icon={categoryIcons[TaskCategory.GYM]} className="text-success" />}
                        >
                          Gym
                        </SelectItem>
                        <SelectItem 
                          key={TaskCategory.CONTENT} 
                          startContent={<Icon icon={categoryIcons[TaskCategory.CONTENT]} className="text-warning" />}
                        >
                          Content
                        </SelectItem>
                        <SelectItem 
                          key={TaskCategory.UNCATEGORIZED} 
                          startContent={<Icon icon={categoryIcons[TaskCategory.UNCATEGORIZED]} className="text-default-500" />}
                        >
                          Uncategorized
                        </SelectItem>
                      </Select>
                    </div>
                    
                    <div>
                      <p className="text-small text-default-500 mb-1">Priority</p>
                      <Select
                        selectedKeys={[editedTask.priority]}
                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })}
                      >
                        <SelectItem 
                          key={TaskPriority.LOW} 
                          startContent={<Icon icon="lucide:arrow-down" className="text-success" />}
                        >
                          Low
                        </SelectItem>
                        <SelectItem 
                          key={TaskPriority.MEDIUM} 
                          startContent={<Icon icon="lucide:minus" className="text-warning" />}
                        >
                          Medium
                        </SelectItem>
                        <SelectItem 
                          key={TaskPriority.HIGH} 
                          startContent={<Icon icon="lucide:arrow-up" className="text-danger" />}
                        >
                          High
                        </SelectItem>
                      </Select>
                    </div>
                    
                    {/* Add Recurrence Options */}
                    <Accordion>
                      <AccordionItem
                        key="1"
                        aria-label="Advanced Options"
                        title="Advanced Options"
                        classNames={{
                          title: "text-medium font-medium",
                        }}
                      >
                        <div className="space-y-4 pt-2">
                          {/* Recurrence Options */}
                          <div>
                            <p className="text-small font-medium mb-2">Recurrence</p>
                            <Select
                              label="Repeat"
                              selectedKeys={[editedTask?.recurrence?.type || RecurrenceType.NONE]}
                              onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
                            >
                              <SelectItem key={RecurrenceType.NONE}>
                                None
                              </SelectItem>
                              <SelectItem key={RecurrenceType.DAILY}>
                                Daily
                              </SelectItem>
                              <SelectItem key={RecurrenceType.WEEKLY}>
                                Weekly
                              </SelectItem>
                              <SelectItem key={RecurrenceType.MONTHLY}>
                                Monthly
                              </SelectItem>
                              <SelectItem key={RecurrenceType.CUSTOM}>
                                Custom
                              </SelectItem>
                            </Select>
                          </div>
                          
                          {/* Show interval input for custom recurrence */}
                          {editedTask?.recurrence?.type === RecurrenceType.CUSTOM && (
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                type="number"
                                min={1}
                                label="Every"
                                value={(editedTask?.recurrence?.interval || 1).toString()}
                                onValueChange={handleRecurrenceIntervalChange}
                              />
                              <Select
                                label="Period"
                                defaultSelectedKeys={["days"]}
                              >
                                <SelectItem key="days">Days</SelectItem>
                                <SelectItem key="weeks">Weeks</SelectItem>
                                <SelectItem key="months">Months</SelectItem>
                              </Select>
                            </div>
                          )}
                          
                          {/* End date for recurring tasks */}
                          {editedTask?.recurrence?.type !== RecurrenceType.NONE && (
                            <DateInput
                              label="End Date (Optional)"
                              value={editedTask?.recurrence?.endDate 
                                ? parseDate(editedTask.recurrence.endDate) 
                                : undefined}
                              onChange={handleRecurrenceEndDateChange}
                            />
                          )}
                          
                          {/* Reminder Options */}
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-small font-medium">Smart Reminder</p>
                              <Switch 
                                size="sm"
                                isSelected={!!editedTask?.reminder?.enabled}
                                onValueChange={handleReminderToggle}
                              />
                            </div>
                            
                            {editedTask?.reminder?.enabled && (
                              <Select
                                label="Remind me"
                                selectedKeys={[editedTask?.reminder?.time 
                                  ? "3" // Default to 3 hours for existing reminders
                                  : "3"]}
                                onChange={(e) => handleReminderHoursChange(e.target.value)}
                              >
                                <SelectItem key="1">1 hour before</SelectItem>
                                <SelectItem key="3">3 hours before</SelectItem>
                                <SelectItem key="6">6 hours before</SelectItem>
                                <SelectItem key="12">12 hours before</SelectItem>
                                <SelectItem key="24">1 day before</SelectItem>
                              </Select>
                            )}
                          </div>
                        </div>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
                
                <div>
                  <p className="text-small text-default-500 mb-1">Description</p>
                  {isEditing ? (
                    <Textarea
                      value={editedTask.description || ''}
                      onValueChange={(value) => setEditedTask({ ...editedTask, description: value })}
                      placeholder="Add a description..."
                      minRows={3}
                    />
                  ) : (
                    <p className="text-medium">
                      {task.description || 'No description provided.'}
                    </p>
                  )}
                </div>
                
                {isEditing && (
                  <div>
                    <p className="text-small text-default-500 mb-1">Calendar</p>
                    <Checkbox
                      isSelected={editedTask.addToCalendar}
                      onValueChange={(value) => setEditedTask({ ...editedTask, addToCalendar: value })}
                    >
                      Add to calendar
                    </Checkbox>
                  </div>
                )}
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Subtasks</h2>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSubtask}
                      onValueChange={setNewSubtask}
                      placeholder="Add a subtask..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask();
                        }
                      }}
                    />
                    <Button
                      isIconOnly
                      onPress={handleAddSubtask}
                      isDisabled={!newSubtask.trim()}
                    >
                      <Icon icon="lucide:plus" />
                    </Button>
                  </div>
                )}
                
                {editedTask.subtasks && editedTask.subtasks.length > 0 ? (
                  <div className="space-y-2">
                    {editedTask.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Checkbox
                          isSelected={subtask.completed}
                          onValueChange={() => handleToggleSubtask(subtask.id)}
                          lineThrough
                        >
                          {subtask.title}
                        </Checkbox>
                        
                        {isEditing && (
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            className="ml-auto"
                            onPress={() => handleRemoveSubtask(subtask.id)}
                          >
                            <Icon icon="lucide:x" width={16} height={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-default-500">No subtasks added.</p>
                )}
              </div>
              
              {isEditing && (
                <>
                  <Divider />
                  
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Tags</h2>
                    
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onValueChange={setNewTag}
                        placeholder="Add a tag..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        isIconOnly
                        onPress={handleAddTag}
                        isDisabled={!newTag.trim()}
                      >
                        <Icon icon="lucide:plus" />
                      </Button>
                    </div>
                    
                    {editedTask.tags && editedTask.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {editedTask.tags.map(tag => (
                          <Chip 
                            key={tag} 
                            variant="flat"
                            color="default"
                            endContent={
                              <button 
                                className="cursor-pointer text-default-400 hover:text-default-600"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <Icon icon="lucide:x" width={14} height={14} />
                              </button>
                            }
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-default-500">No tags added.</p>
                    )}
                  </div>
                </>
              )}
              
              <Divider />
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Notes</h2>
                
                {isEditing ? (
                  <Textarea
                    value={editedTask.notes || ''}
                    onValueChange={(value) => setEditedTask({ ...editedTask, notes: value })}
                    placeholder="Add notes or comments..."
                    minRows={4}
                  />
                ) : (
                  <p className="text-medium whitespace-pre-wrap">
                    {task.notes || 'No notes added.'}
                  </p>
                )}
              </div>
              
              {!isEditing && (
                <div className="text-small text-default-500">
                  Created on {new Date(task.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
      
      {/* Add Focus Timer Modal */}
      <FocusTimer 
        task={task} 
        isOpen={isFocusTimerOpen} 
        onClose={() => setIsFocusTimerOpen(false)} 
      />
    </div>
  );
};
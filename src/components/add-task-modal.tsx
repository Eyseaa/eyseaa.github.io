import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Textarea, 
  Select, 
  SelectItem, 
  Checkbox,
  DateInput,
  Accordion,
  AccordionItem,
  Switch
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { parseDate } from '@internationalized/date';
import { Task, TaskPriority, TaskCategory, RecurrenceType } from '../types/task';
import { useTaskContext } from '../context/task-context';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState<Date>(new Date());
  const [dueTime, setDueTime] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>(TaskPriority.MEDIUM);
  const [category, setCategory] = React.useState<TaskCategory>(TaskCategory.UNCATEGORIZED);
  const [tags, setTags] = React.useState('');
  const [addToCalendar, setAddToCalendar] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Add new state for recurring tasks
  const [recurrenceType, setRecurrenceType] = React.useState<RecurrenceType>(RecurrenceType.NONE);
  const [recurrenceInterval, setRecurrenceInterval] = React.useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = React.useState<Date | null>(null);
  
  // Add new state for reminders
  const [enableReminder, setEnableReminder] = React.useState(false);
  const [reminderHours, setReminderHours] = React.useState(3); // Default 3 hours before
  
  const handleSubmit = () => {
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    const formattedDate = dueDate.toISOString().split('T')[0];
    
    // Calculate reminder time if enabled
    let reminderTime: string | undefined;
    if (enableReminder && dueTime) {
      const taskDateTime = new Date(`${formattedDate}T${dueTime}`);
      const reminderDateTime = new Date(taskDateTime.getTime() - (reminderHours * 60 * 60 * 1000));
      reminderTime = reminderDateTime.toISOString();
    }
    
    const newTask: Omit<Task, 'id' | 'createdAt' | 'status'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: formattedDate,
      dueTime: dueTime || undefined,
      priority,
      category,
      tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : undefined,
      addToCalendar,
      // Add recurrence data if not NONE
      ...(recurrenceType !== RecurrenceType.NONE && {
        recurrence: {
          type: recurrenceType,
          ...(recurrenceType === RecurrenceType.CUSTOM && { interval: recurrenceInterval }),
          ...(recurrenceEndDate && { endDate: recurrenceEndDate.toISOString().split('T')[0] }),
        }
      }),
      // Add reminder data if enabled
      ...(enableReminder && {
        reminder: {
          enabled: true,
          time: reminderTime,
          notified: false
        }
      })
    };
    
    addTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setDueTime('');
    setPriority(TaskPriority.MEDIUM);
    setCategory(TaskCategory.UNCATEGORIZED);
    setTags('');
    setAddToCalendar(true);
    setRecurrenceType(RecurrenceType.NONE);
    setRecurrenceInterval(1);
    setRecurrenceEndDate(null);
    setEnableReminder(false);
    setReminderHours(3);
    
    setIsSubmitting(false);
    onClose();
  };
  
  const handleDateChange = (value: any) => {
    if (value) {
      const jsDate = new Date(
        value.year,
        value.month - 1,
        value.day
      );
      setDueDate(jsDate);
    }
  };
  
  const handleRecurrenceEndDateChange = (value: any) => {
    if (value) {
      const jsDate = new Date(
        value.year,
        value.month - 1,
        value.day
      );
      setRecurrenceEndDate(jsDate);
    } else {
      setRecurrenceEndDate(null);
    }
  };
  
  // Category icon mapping
  const categoryIcons = {
    [TaskCategory.BRAND]: "lucide:shopping-bag",
    [TaskCategory.PERSONAL]: "lucide:user",
    [TaskCategory.GYM]: "lucide:dumbbell",
    [TaskCategory.CONTENT]: "lucide:image",
    [TaskCategory.UNCATEGORIZED]: "lucide:folder",
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Task
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  autoFocus
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={title}
                  onValueChange={setTitle}
                  isRequired
                />
                
                <Textarea
                  label="Description"
                  placeholder="Add details about this task..."
                  value={description}
                  onValueChange={setDescription}
                  minRows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateInput
                    label="Due Date"
                    value={parseDate(dueDate.toISOString().split('T')[0])}
                    onChange={handleDateChange}
                  />
                  
                  <Input
                    label="Due Time"
                    placeholder="HH:MM"
                    type="time"
                    value={dueTime}
                    onValueChange={setDueTime}
                  />
                </div>
                
                {/* Add Category Select */}
                <Select
                  label="Category"
                  selectedKeys={[category]}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
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
                
                <Select
                  label="Priority"
                  selectedKeys={[priority]}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
                
                <Input
                  label="Tags"
                  placeholder="design, marketing, website (comma separated)"
                  value={tags}
                  onValueChange={setTags}
                />
                
                {/* Add Accordion for advanced options */}
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
                          selectedKeys={[recurrenceType]}
                          onChange={(e) => setRecurrenceType(e.target.value as RecurrenceType)}
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
                      {recurrenceType === RecurrenceType.CUSTOM && (
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            type="number"
                            min={1}
                            label="Every"
                            value={recurrenceInterval.toString()}
                            onValueChange={(value) => setRecurrenceInterval(parseInt(value) || 1)}
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
                      {recurrenceType !== RecurrenceType.NONE && (
                        <DateInput
                          label="End Date (Optional)"
                          value={recurrenceEndDate ? parseDate(recurrenceEndDate.toISOString().split('T')[0]) : undefined}
                          onChange={handleRecurrenceEndDateChange}
                        />
                      )}
                      
                      {/* Reminder Options */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-small font-medium">Smart Reminder</p>
                          <Switch 
                            size="sm"
                            isSelected={enableReminder}
                            onValueChange={setEnableReminder}
                          />
                        </div>
                        
                        {enableReminder && (
                          <Select
                            label="Remind me"
                            selectedKeys={[reminderHours.toString()]}
                            onChange={(e) => setReminderHours(parseInt(e.target.value))}
                          >
                            <SelectItem key="1">1 hour before</SelectItem>
                            <SelectItem key="3">3 hours before</SelectItem>
                            <SelectItem key="6">6 hours before</SelectItem>
                            <SelectItem key="12">12 hours before</SelectItem>
                            <SelectItem key="24">1 day before</SelectItem>
                          </Select>
                        )}
                      </div>
                      
                      <Checkbox 
                        isSelected={addToCalendar} 
                        onValueChange={setAddToCalendar}
                      >
                        Add to calendar
                      </Checkbox>
                    </div>
                  </AccordionItem>
                </Accordion>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit} 
                isDisabled={!title.trim()}
                isLoading={isSubmitting}
              >
                Create Task
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
import { Task, TaskPriority, TaskStatus, TaskCategory } from '../types/task';

export const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return [
    {
      id: '1',
      title: 'Finalize Summer Collection Designs',
      description: 'Review and approve the final designs for the summer collection.',
      dueDate: formatDate(today),
      dueTime: '14:00',
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.BRAND,
      tags: ['design', 'collection'],
      subtasks: [
        { id: '1-1', title: 'Review color palette', completed: true },
        { id: '1-2', title: 'Approve fabric choices', completed: false },
        { id: '1-3', title: 'Finalize pricing strategy', completed: false },
      ],
      notes: 'Need to focus on sustainability aspects in the marketing materials.',
      addToCalendar: true,
      createdAt: new Date(today.getTime() - 86400000).toISOString(),
    },
    {
      id: '2',
      title: 'Schedule Photoshoot for New Collection',
      description: 'Book photographer, models, and location for the upcoming collection photoshoot.',
      dueDate: formatDate(tomorrow),
      dueTime: '10:00',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      category: TaskCategory.CONTENT,
      tags: ['marketing', 'photoshoot'],
      addToCalendar: true,
      createdAt: new Date(today.getTime() - 172800000).toISOString(),
    },
    {
      id: '3',
      title: 'Meet with Potential Retail Partner',
      description: 'Discuss collaboration opportunities with Urban Outfitters.',
      dueDate: formatDate(today),
      dueTime: '16:30',
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.BRAND,
      tags: ['partnership', 'retail'],
      notes: 'Prepare sales figures and growth projections.',
      addToCalendar: true,
      createdAt: new Date(today.getTime() - 259200000).toISOString(),
    },
    {
      id: '4',
      title: 'Review Social Media Strategy',
      description: 'Analyze performance of recent campaigns and plan content for next month.',
      dueDate: formatDate(tomorrow),
      dueTime: '13:00',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      category: TaskCategory.CONTENT,
      tags: ['marketing', 'social media'],
      createdAt: new Date(today.getTime() - 345600000).toISOString(),
    },
    {
      id: '5',
      title: 'Update Website Product Listings',
      description: 'Add new products and update inventory for existing items.',
      dueDate: formatDate(nextWeek),
      priority: TaskPriority.LOW,
      status: TaskStatus.PENDING,
      category: TaskCategory.BRAND,
      tags: ['website', 'inventory'],
      createdAt: new Date(today.getTime() - 432000000).toISOString(),
    },
    {
      id: '6',
      title: 'Brainstorm Fall Collection Concepts',
      description: 'Generate ideas and themes for the upcoming fall collection.',
      dueDate: formatDate(nextWeek),
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      category: TaskCategory.BRAND,
      tags: ['design', 'planning'],
      createdAt: new Date(today.getTime() - 518400000).toISOString(),
    },
    {
      id: '7',
      title: 'Order Business Cards',
      description: 'Design and order new business cards with updated branding.',
      dueDate: formatDate(today),
      priority: TaskPriority.LOW,
      status: TaskStatus.COMPLETED,
      category: TaskCategory.PERSONAL,
      tags: ['admin'],
      createdAt: new Date(today.getTime() - 604800000).toISOString(),
    },
    {
      id: '8',
      title: 'Morning Workout Session',
      description: 'Complete 45-minute strength training routine.',
      dueDate: formatDate(today),
      dueTime: '07:30',
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.PENDING,
      category: TaskCategory.GYM,
      tags: ['fitness', 'routine'],
      createdAt: new Date(today.getTime() - 259200000).toISOString(),
    },
    {
      id: '9',
      title: 'Plan Content Calendar for Q3',
      description: 'Outline social media and blog content for next quarter.',
      dueDate: formatDate(nextWeek),
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING,
      category: TaskCategory.CONTENT,
      tags: ['planning', 'social'],
      createdAt: new Date(today.getTime() - 172800000).toISOString(),
    },
    {
      id: '10',
      title: 'Schedule Annual Health Checkup',
      description: 'Book appointment with primary care physician.',
      dueDate: formatDate(nextWeek),
      priority: TaskPriority.LOW,
      status: TaskStatus.PENDING,
      category: TaskCategory.PERSONAL,
      createdAt: new Date(today.getTime() - 86400000).toISOString(),
    },
  ];
};
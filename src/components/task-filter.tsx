import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';

interface TaskFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <Tabs 
      aria-label="Task filters" 
      selectedKey={activeFilter}
      onSelectionChange={onFilterChange}
      variant="light"
      color="primary"
      classNames={{
        tabList: "overflow-x-auto flex-nowrap",
        cursor: "bg-primary-100 dark:bg-primary-800"
      }}
    >
      <Tab
        key="today"
        title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:calendar-check" width={16} height={16} />
            <span>Today</span>
          </div>
        }
      />
      <Tab
        key="upcoming"
        title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:calendar-days" width={16} height={16} />
            <span>Upcoming</span>
          </div>
        }
      />
      <Tab
        key="priority"
        title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:flag" width={16} height={16} />
            <span>Priority</span>
          </div>
        }
      />
      <Tab
        key="all"
        title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:list" width={16} height={16} />
            <span>All</span>
          </div>
        }
      />
      <Tab
        key="completed"
        title={
          <div className="flex items-center gap-2">
            <Icon icon="lucide:check-circle" width={16} height={16} />
            <span>Completed</span>
          </div>
        }
      />
    </Tabs>
  );
};
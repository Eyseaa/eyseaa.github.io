import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { TaskCategory } from '../types/task';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange 
}) => {
  const categoryIcons = {
    'all': "lucide:layers",
    [TaskCategory.BRAND]: "lucide:shopping-bag",
    [TaskCategory.PERSONAL]: "lucide:user",
    [TaskCategory.GYM]: "lucide:dumbbell",
    [TaskCategory.CONTENT]: "lucide:image",
    [TaskCategory.UNCATEGORIZED]: "lucide:folder",
  };

  return (
    <Tabs 
      aria-label="Task categories" 
      selectedKey={activeCategory}
      onSelectionChange={onCategoryChange}
      variant="bordered"
      color="primary"
      classNames={{
        tabList: "overflow-x-auto flex-nowrap",
      }}
    >
      <Tab
        key="all"
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons.all} width={16} height={16} />
            <span>All</span>
          </div>
        }
      />
      <Tab
        key={TaskCategory.BRAND}
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons[TaskCategory.BRAND]} width={16} height={16} className="text-primary" />
            <span>Brand</span>
          </div>
        }
      />
      <Tab
        key={TaskCategory.PERSONAL}
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons[TaskCategory.PERSONAL]} width={16} height={16} className="text-secondary" />
            <span>Personal</span>
          </div>
        }
      />
      <Tab
        key={TaskCategory.GYM}
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons[TaskCategory.GYM]} width={16} height={16} className="text-success" />
            <span>Gym</span>
          </div>
        }
      />
      <Tab
        key={TaskCategory.CONTENT}
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons[TaskCategory.CONTENT]} width={16} height={16} className="text-warning" />
            <span>Content</span>
          </div>
        }
      />
      <Tab
        key={TaskCategory.UNCATEGORIZED}
        title={
          <div className="flex items-center gap-2">
            <Icon icon={categoryIcons[TaskCategory.UNCATEGORIZED]} width={16} height={16} />
            <span>Other</span>
          </div>
        }
      />
    </Tabs>
  );
};
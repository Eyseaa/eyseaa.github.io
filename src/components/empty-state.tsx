import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-primary-900">
        <Icon icon={icon} width={32} height={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-default-500 mb-6 max-w-md">{description}</p>
      
      {actionLabel && onAction && (
        <Button color="primary" onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
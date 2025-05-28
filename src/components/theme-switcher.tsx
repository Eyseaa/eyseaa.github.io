import React from 'react';
import { useTheme } from "@heroui/use-theme";
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        isIconOnly 
        size="sm" 
        variant="flat" 
        color="default" 
        className="rounded-full"
        onPress={toggleTheme}
      >
        <Icon 
          icon={isDark ? "lucide:sun" : "lucide:moon"} 
          width={18} 
          height={18} 
        />
      </Button>
    </div>
  );
};
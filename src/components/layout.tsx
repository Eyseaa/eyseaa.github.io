import React from 'react';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/auth-context';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const history = useHistory();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/dashboard', icon: 'lucide:home', label: 'Home' },
    { path: '/tasks', icon: 'lucide:check-square', label: 'Tasks' },
    { path: '/calendar', icon: 'lucide:calendar', label: 'Calendar' },
  ];

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto pb-16 md:pb-0 md:pl-16">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <Link to={item.path} key={item.path} className="w-full">
                <div className="flex flex-col items-center justify-center h-full relative">
                  <Button
                    variant="light"
                    color={isActive ? "primary" : "default"}
                    className="min-w-0 h-12 px-2"
                    startContent={
                      <Icon icon={item.icon} width={20} height={20} />
                    }
                  >
                    <span className="text-xs">{item.label}</span>
                  </Button>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator-mobile"
                      className="absolute bottom-0 h-0.5 w-12 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col w-16 bg-content1 border-r border-divider">
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <Link to={item.path} key={item.path} className="relative">
                <Button
                  isIconOnly
                  variant="light"
                  color={isActive ? "primary" : "default"}
                  size="lg"
                  className="rounded-xl"
                >
                  <Icon icon={item.icon} width={22} height={22} />
                </Button>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Add logout button */}
        <div className="flex flex-col items-center pb-6">
          <Button
            isIconOnly
            variant="light"
            color="default"
            size="lg"
            className="rounded-xl text-danger"
            onPress={handleLogout}
          >
            <Icon icon="lucide:log-out" width={22} height={22} />
          </Button>
        </div>
      </nav>
    </div>
  );
};
import React from 'react';
import { Card, CardBody, Button, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Task } from '../types/task';
import { useTaskContext } from '../context/task-context';

interface FocusTimerProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ task, isOpen, onClose }) => {
  const { toggleTaskStatus } = useTaskContext();
  
  // Timer states
  const [mode, setMode] = React.useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = React.useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = React.useState(false);
  const [cycles, setCycles] = React.useState(0);
  
  // Timer settings
  const focusTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  
  // Timer interval ref
  const timerRef = React.useRef<number | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = mode === 'focus' ? focusTime : breakTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Handle timer start/pause
  const toggleTimer = () => {
    if (isActive) {
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      // Start timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {
              // Handle browsers that block autoplay
              console.log('Audio playback was prevented');
            });
            
            // Switch modes
            if (mode === 'focus') {
              setCycles(prev => prev + 1);
              setMode('break');
              return breakTime;
            } else {
              setMode('focus');
              return focusTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
    setMode('focus');
    setTimeLeft(focusTime);
    setCycles(0);
  };
  
  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Reset timer when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      resetTimer();
    }
  }, [isOpen]);
  
  // Handle task completion
  const handleCompleteTask = () => {
    if (task) {
      toggleTaskStatus(task.id);
    }
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clock" />
                <span>Focus Timer</span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                {task && (
                  <div className="mb-4 text-center">
                    <h3 className="text-xl font-semibold">{task.title}</h3>
                    <p className="text-default-500">Focus on this task</p>
                  </div>
                )}
                
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="relative w-48 h-48 mb-6"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Progress
                      size="lg"
                      value={calculateProgress()}
                      color={mode === 'focus' ? "primary" : "success"}
                      className="w-48 h-48"
                      classNames={{
                        track: "stroke-current",
                        indicator: "stroke-current",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
                    <span className="text-default-500 capitalize">{mode} Time</span>
                  </div>
                </motion.div>
                
                <div className="flex gap-4 mb-4">
                  <Button
                    color={isActive ? "warning" : "primary"}
                    startContent={<Icon icon={isActive ? "lucide:pause" : "lucide:play"} />}
                    onPress={toggleTimer}
                  >
                    {isActive ? "Pause" : "Start"}
                  </Button>
                  <Button
                    variant="flat"
                    startContent={<Icon icon="lucide:refresh-cw" />}
                    onPress={resetTimer}
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="text-center text-default-500">
                  <p>Completed cycles: {cycles}</p>
                  <p className="text-small mt-1">
                    {mode === 'focus' 
                      ? "Focus on your task. Stay concentrated!" 
                      : "Take a short break. Stretch or relax your eyes."}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
              {task && (
                <Button 
                  color="success" 
                  startContent={<Icon icon="lucide:check" />}
                  onPress={handleCompleteTask}
                >
                  Mark Complete
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
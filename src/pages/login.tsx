import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardHeader,
  CardFooter,
  Input, 
  Button, 
  Divider,
  Link,
  Tabs,
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/auth-context';

export const Login: React.FC = () => {
  // Existing login state
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // New registration state
  const [registerUsername, setRegisterUsername] = React.useState('');
  const [registerEmail, setRegisterEmail] = React.useState('');
  const [registerPassword, setRegisterPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [registerError, setRegisterError] = React.useState('');
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // Tab selection state
  const [selectedTab, setSelectedTab] = React.useState("login");
  
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  
  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      history.replace('/dashboard');
    }
  }, [isAuthenticated, history]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        history.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate registration form
    if (!registerUsername.trim() || !registerEmail.trim() || !registerPassword.trim() || !confirmPassword.trim()) {
      setRegisterError('Please fill in all fields');
      return;
    }
    
    if (!registerEmail.includes('@') || !registerEmail.includes('.')) {
      setRegisterError('Please enter a valid email address');
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    if (registerPassword.length < 8) {
      setRegisterError('Password must be at least 8 characters long');
      return;
    }
    
    setRegisterError('');
    setIsRegistering(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll just show a success message and switch to login
      
      // Clear registration form
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      
      // Switch to login tab
      setSelectedTab('login');
      
      // Set username from registration
      setUsername(registerUsername);
      
      // Show success toast
      addToast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
        color: "success",
      });
      
    } catch (err) {
      setRegisterError('An error occurred during registration. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-content2/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card shadow="sm" className="border border-divider">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
              R
            </div>
            <h1 className="text-2xl font-semibold">Reliance Task Manager</h1>
            <p className="text-default-500 text-center">
              {selectedTab === 'login' 
                ? 'Sign in to access your tasks and manage your schedule' 
                : 'Create an account to get started with Reliance'}
            </p>
          </CardHeader>
          
          <CardBody>
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={setSelectedTab}
              variant="underlined"
              color="primary"
              classNames={{
                tabList: "gap-6",
                cursor: "w-full",
                tab: "px-0 h-12",
              }}
            >
              <Tab 
                key="login" 
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:log-in" />
                    <span>Login</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                      autoFocus
                      label="Username"
                      placeholder="Enter your username"
                      value={username}
                      onValueChange={setUsername}
                      startContent={<Icon icon="lucide:user" className="text-default-400" />}
                      isInvalid={!!error}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onValueChange={setPassword}
                      type={showPassword ? "text" : "password"}
                      startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                      endContent={
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="focus:outline-none"
                        >
                          <Icon 
                            icon={showPassword ? "lucide:eye-off" : "lucide:eye"} 
                            className="text-default-400 hover:text-default-500 transition-colors"
                          />
                        </button>
                      }
                      isInvalid={!!error}
                      errorMessage={error}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                        <span className="text-sm">Remember me</span>
                      </label>
                      
                      <Link href="#" size="sm" className="text-primary">
                        Forgot password?
                      </Link>
                    </div>
                    
                    <Button
                      type="submit"
                      color="primary"
                      fullWidth
                      isLoading={isLoading}
                      startContent={!isLoading && <Icon icon="lucide:log-in" />}
                    >
                      Sign In
                    </Button>
                  </form>
                </div>
              </Tab>
              
              <Tab 
                key="register" 
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:user-plus" />
                    <span>Register</span>
                  </div>
                }
              >
                <div className="pt-4">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <Input
                      autoFocus
                      label="Username"
                      placeholder="Choose a username"
                      value={registerUsername}
                      onValueChange={setRegisterUsername}
                      startContent={<Icon icon="lucide:user" className="text-default-400" />}
                      isInvalid={!!registerError}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <Input
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={registerEmail}
                      onValueChange={setRegisterEmail}
                      startContent={<Icon icon="lucide:mail" className="text-default-400" />}
                      isInvalid={!!registerError}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <Input
                      label="Password"
                      placeholder="Create a password"
                      value={registerPassword}
                      onValueChange={setRegisterPassword}
                      type={showRegisterPassword ? "text" : "password"}
                      startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleRegisterPasswordVisibility}
                          className="focus:outline-none"
                        >
                          <Icon 
                            icon={showRegisterPassword ? "lucide:eye-off" : "lucide:eye"} 
                            className="text-default-400 hover:text-default-500 transition-colors"
                          />
                        </button>
                      }
                      isInvalid={!!registerError}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <Input
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onValueChange={setConfirmPassword}
                      type={showConfirmPassword ? "text" : "password"}
                      startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                      endContent={
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="focus:outline-none"
                        >
                          <Icon 
                            icon={showConfirmPassword ? "lucide:eye-off" : "lucide:eye"} 
                            className="text-default-400 hover:text-default-500 transition-colors"
                          />
                        </button>
                      }
                      isInvalid={!!registerError}
                      errorMessage={registerError}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-divider",
                      }}
                    />
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="terms" className="rounded text-primary focus:ring-primary" required />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <Link href="#" size="sm" className="text-primary">Terms of Service</Link> and <Link href="#" size="sm" className="text-primary">Privacy Policy</Link>
                      </label>
                    </div>
                    
                    <Button
                      type="submit"
                      color="primary"
                      fullWidth
                      isLoading={isRegistering}
                      startContent={!isRegistering && <Icon icon="lucide:user-plus" />}
                    >
                      Create Account
                    </Button>
                  </form>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
          
          <Divider />
          
          <CardFooter className="flex flex-col gap-2 py-4">
            <p className="text-center text-small text-default-500">
              Demo credentials: username: <span className="font-semibold">demo</span>, password: <span className="font-semibold">demo123</span>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center mt-4 text-small text-default-500">
          &copy; {new Date().getFullYear()} Reliance Streetwear. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useTheme } from "@heroui/use-theme";
import { TaskProvider } from './context/task-context';
import { Layout } from './components/layout';
import { Dashboard } from './pages/dashboard';
import { Tasks } from './pages/tasks';
import { Calendar } from './pages/calendar';
import { TaskDetail } from './pages/task-detail';
import { ThemeSwitcher } from './components/theme-switcher';
import { Login } from './pages/login';
import { AuthProvider, useAuth } from './context/auth-context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen bg-background text-foreground">
          <ThemeSwitcher />
          <Switch>
            <Route path="/login" component={Login} />
            <ProtectedRoute path="/dashboard" component={() => (
              <Layout>
                <Dashboard />
              </Layout>
            )} />
            <ProtectedRoute path="/tasks" exact component={() => (
              <Layout>
                <Tasks />
              </Layout>
            )} />
            <ProtectedRoute path="/tasks/:id" component={() => (
              <Layout>
                <TaskDetail />
              </Layout>
            )} />
            <ProtectedRoute path="/calendar" component={() => (
              <Layout>
                <Calendar />
              </Layout>
            )} />
            <Redirect from="/" to="/login" />
          </Switch>
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
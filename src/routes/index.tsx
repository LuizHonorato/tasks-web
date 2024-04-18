import React from 'react';
import { Navigate, Routes as ReactDOMRoutes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import TasksList from '../pages/TasksList';
import TaskForm from '../pages/TaskForm';
import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <ReactDOMRoutes>
            <Route path="/" element={!user ? <SignIn /> : <Navigate to='/tasks' replace />} />
            <Route path="/signup" element={!user ? <SignUp /> : <Navigate to='/tasks' replace />} />

            <Route path="/tasks" element={user ? <TasksList /> : <Navigate to='/' replace />} />
            <Route path="/tasks/form" element={user ? <TaskForm /> : <Navigate to='/' replace />} />
        </ReactDOMRoutes>
    );
}

export default Routes;
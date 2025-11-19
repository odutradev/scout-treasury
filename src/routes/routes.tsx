import { Navigate } from 'react-router-dom';

import Dashboard from '@pages/dashboard';
import NotFound from '@pages/notFound';
import SignIn from '@pages/signIn';
import Home from '@pages/home';

const routes = [
    {
        path: '/',
        privateRoute: false,
        routes: [
            ['*', <Navigate to="/not-found" replace/>],
            ['/not-found', <NotFound />],
            ['/signin', <SignIn />],
            ['', <Navigate to="/signin" replace />]
        ]
    },
    {
        path: '/home',
        privateRoute: true,
        routes: [
            ['', <Home />]
        ]
    },
    {
        path: '/dashboard',
        privateRoute: true,
        routes: [
            ['/general', <Dashboard />]
        ]
    }
];

export default routes;
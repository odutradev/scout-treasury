import { Navigate } from 'react-router-dom';

import CashManagement from '@pages/cashManagement';
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
        path: '/',
        privateRoute: true,
        routes: [
            ['cash-management', <CashManagement />],
            ['home', <Home />],
        ]
    }
];

export default routes;
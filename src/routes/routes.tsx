import { Navigate } from "react-router-dom";

import InitialRoute from "@routes/components/initialRoute";
import Dashboard from "@pages/dashboard";
import NotFound from "@pages/notFound";

const routes = [
    {
        path: "/",
        privateRoute: false,
        routes: [
            ["*", <Navigate to="/not-found" replace/>],
            ['/not-found', <NotFound />],
            ['', <InitialRoute />],
        ]
    },
    {
        path: "/dashboard",
        privateRoute: true,
        routes: [
            ['/general', <Dashboard />],
        ]
    }
];

export default routes;
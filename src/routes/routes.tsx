import { Navigate } from "react-router-dom";

import InitialRoute from "@routes/components/initialRoute";
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
    }
];

export default routes;
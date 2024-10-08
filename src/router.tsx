import { createBrowserRouter } from "react-router-dom";
import App from "./app";
import ErrorPage from "./error";
import Dashboard from "./pages/dashboard";
import Investments from "./pages/investments";
import Insights from "./pages/insights";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "investments",
        element: <Investments />
      },
      {
        path: "insights",
        element: <Insights />
      },
    ],
  },
]);

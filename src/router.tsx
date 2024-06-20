import { createBrowserRouter } from "react-router-dom";
import App from "./app";
import About from "./pages/about";
import ErrorPage from "./error";
import Dashboard from "./pages/dashboard";
import Investments from "./pages/investments";

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
        path: "about",
        element: <About />,
      },
    ],
  },
]);

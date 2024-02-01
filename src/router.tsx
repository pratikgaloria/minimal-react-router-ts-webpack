import { createBrowserRouter } from "react-router-dom";
import App from "./app";
import About from "./about";
import ErrorPage from "./error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

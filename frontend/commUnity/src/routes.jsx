import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./Home";
import MyCommunity from "./MyCommunity";
import Events from "./Events";
import Notice from "./Notice";
import Header from "./components/Header";
import { Outlet } from "react-router-dom"; // Outlet is used to render child components
import MyAccount from "./MyAccount";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />{" "}
        {/* This renders child routes like /community, /events, etc. */}
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "community", // This matches "/community"
        element: <MyCommunity />,
      },
      {
        path: "events", // This matches "/events"
        element: <Events />,
      },
      {
        path: "notice", // This matches "/notice"
        element: <Notice />,
      },
      {
        path: "/account",
        element: <MyAccount />,
      },
    ],
  },
]);

export default router;

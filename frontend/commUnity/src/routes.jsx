import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./Home";
import MyCommunity from "./MyCommunity";
import Events from "./Events";
import Notice from "./Notice";
import Header from "./components/Header";
import MyAccount from "./MyAccount";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./globalContext/AuthContext.jsx";
import ExploreCommunity from "./components/ExploreCommunity.jsx";
import SearchCommunity from "./components/SearchCommunity.jsx";
import EditCommunity from "./components/EditCommunity.jsx";

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
      <AuthProvider>
        <Header />
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "community",
        element: <ProtectedRoute />, // Protect this route
        children: [
          { path: "", element: <MyCommunity /> },
          { path: "explore", element: <ExploreCommunity /> },
          { path: "find", element: <SearchCommunity /> },
          { path: "explore/edit", element: <EditCommunity /> },
        ],
      },
      {
        path: "events",
        element: <ProtectedRoute />, // Protect this route
        children: [{ path: "", element: <Events /> }],
      },
      {
        path: "notice",
        element: <ProtectedRoute />, // Protect this route
        children: [{ path: "", element: <Notice /> }],
      },
      {
        path: "/account",
        element: <ProtectedRoute />, // Protect MyAccount
        children: [{ path: "", element: <MyAccount /> }],
      },
    ],
  },
]);

export default router;

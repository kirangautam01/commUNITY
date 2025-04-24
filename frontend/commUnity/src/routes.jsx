import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./Home.jsx";
import MyCommunity from "./MyCommunity.jsx";
import Events from "./Events.jsx";
import Notice from "./Notice.jsx";
import Header from "./components/Header.jsx";
import MyAccount from "./MyAccount.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./globalContext/AuthContext.jsx";
import ExploreCommunity from "./components/ExploreCommunity.jsx";
import SearchCommunity from "./components/SearchCommunity.jsx";
import EditCommunity from "./components/EditCommunity.jsx";
import Footer from "./components/Footer.jsx";
import Chatbox from "./components/Chatbox.jsx";
import LoadFromTop from "./components/LoadFromTop.jsx";
import CommunityGuides from "./components/CommunityGuides.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

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
    path: "/guides",
    element: <CommunityGuides />,
  },
  {
    path: "/pass_forgot",
    element: <ForgotPassword />,
  },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/",
    element: (
      <AuthProvider>
        <LoadFromTop />
        <Header />
        <Outlet />
        <Footer />
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
        path: "account",
        element: <ProtectedRoute />, // Protect MyAccount
        children: [{ path: "", element: <MyAccount /> }],
      },
      {
        path: "chatbox",
        element: <ProtectedRoute />,
        children: [
          {
            path: ":id", // Accept the dynamic community ID here
            element: <Chatbox />,
          },
        ],
      },
    ],
  },
]);

export default router;

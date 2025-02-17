import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import Landing from "./pages/Landing";
import store from "./app/store";
import MyProfile from "./pages/MyProfile";
import Bookmark from "./pages/Bookmark";
import { initialStateFromLocalStorage } from "./features/authSlice";
import PostDetails from "./pages/PostDetails";
import FollowersUserList from "./pages/FollowersUserList";
import FollowingsUserList from "./pages/FollowingsUserList";
import UserList from "./pages/UserList";
import UserEditForm from "./pages/UserEditForm";

//const selectIsAuthenticated = (state) => state.auth.token !== null && state.auth.user !== null

const router = createBrowserRouter([
  {
    path: "/landing",
    element: <App />,
  },
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/bookmark",
    element: <Bookmark />,
  },
  {
    path: "/profile/:userId",
    element: <MyProfile />,
  },
  {
    path: "/postDetails/:postId",
    element: <PostDetails />,
  },

  {
    path: "/userlist/:userId",
    element: <UserList />,
    children: [
      {
        path: "followers",
        element: <FollowersUserList />,
      },
      {
        path: "followings",
        element: <FollowingsUserList />,
      },
    ],
  },

  {
    path: "/userEditForm",
    element: <UserEditForm />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

const Root = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialStateFromLocalStorage());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);

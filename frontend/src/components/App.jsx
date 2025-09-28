import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";
import Mangas from "../Containers/Mangas";
import { useCallback, useState } from "react";
import { AuthContext } from "../context/auth-context";
import Auth from "../Containers/Auth";
import Subscribe from "../Containers/Subscribe";
import Collection from "../Containers/Collections";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [userToken, setUserToken] = useState(
    sessionStorage.getItem("userToken")
  );

  const login = useCallback((id, token) => {
    setIsLoggedIn(true);
    setUserId(id);
    setUserToken(token);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", id);
    sessionStorage.setItem("userToken", token);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setUserToken(null);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userToken");
  }, []);

  const routerLoggedIn = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/login", element: <Navigate to="/mangas" replace /> },
        { path: "", element: <Mangas /> },
        {
          path: "mangas",
          element: <Mangas />,
        },
        { path: "collection", element: <Collection /> },
      ],
    },
  ]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "", element: <Mangas /> },
        { path: "mangas", element: <Mangas /> },
        { path: "login", element: <Auth /> },
        { path: "subscribe", element: <Subscribe /> },
      ],
    },
  ]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, userToken, login, logout }}
    >
      <RouterProvider router={isLoggedIn ? routerLoggedIn : router} />
    </AuthContext.Provider>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, Outlet, useNavigate } from "react-router-dom";

// 🔹 Layout
import Adminlayout from "../components/layout/Adminlayout";

// 🔹 Pages
import Auth from "../components/auth/Auth";
import Dash from "../pages/dash/Dash";
import Blogs from "../pages/blogs/Blogs";
import Banners from "../pages/banners/Banners";
import Enquiries from "../pages/enquiries/Enquiries";
import Reviews from "../pages/reviews/Reviews";
import Subscribers from "../pages/subscribers/Subscribers";
import Singleenquirie from "../pages/enquiries/Singleenquirie";

// 🔹 API + Auth Pages
import { checkLoginStatus } from "../api/api";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import Clients from "../pages/clients/Clients";
import Projects from "../pages/projects/Projects";
import Work from "../pages/work/Work";
import Admin from "../components/admin/Admin";
import { isLoginSuccess } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Voucher from "../pages/voucher/Voucher";
// ===================================================
// 🔸 Private Route Wrapper (For Protected Admin Pages)
// ===================================================
const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await checkLoginStatus();
        if (res?.success) {
          const userData = {
            _id: res?.data?._id || res?.data?.id,
            name: res?.data?.name,
            email: res?.data?.email,
            role: res?.data?.role,
            phone: res?.data?.phone,
            img: res?.data?.img,
          };
          // ✅ Dispatch login success to Redux
          dispatch(isLoginSuccess(userData));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/", { replace: true });
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// ===================================================
// 🔸 Router Configuration
// ===================================================
const router = createBrowserRouter([
  // 🔹 Public Routes
  { path: "/", element: <Auth /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  // 🔹 Protected Admin Routes
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/mec-admin",
        element: <Adminlayout />,
        children: [
          { index: true, element: <Dash /> },
          { path: "blogs", element: <Blogs /> },
          { path: "banners", element: <Banners /> },
          { path: "clients", element: <Clients /> },
          { path: "enquiries", element: <Enquiries /> },
          { path: "enquiries/:id", element: <Singleenquirie /> }, // ✅ moved inside protected layout
          { path: "reviews", element: <Reviews /> },
          { path: "subscribers", element: <Subscribers /> },
          { path: "voucher", element: <Voucher /> },
          { path: "project", element: <Projects /> },
          { path: "work", element: <Work /> },
          { path: "admin", element: <Admin /> },
        ],
      },
    ],
  },

  // 🔹 Fallback for Unknown Paths
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;

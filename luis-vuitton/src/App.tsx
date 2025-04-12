import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Products from "./pages/Products";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import CartComponent from "./pages/CartComponent";
import Bill from "./pages/Bill";
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Forgot from "./pages/Forgot";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminMain from "./pages/Admin/AdminMain";
import SellerMain from "./pages/Seller/SellerMain";
import CreateItem from "./pages/Seller/CreateItem";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import DetailOrder from "./pages/Seller/DetailOrder";
import NewPassword from "./pages/NewPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "items/:category",
        element: <Items />,
      },
      {
        path: "detail/:idProduct",
        element: <ItemDetail />,
      },
      {
        path: "cart",
        element: <CartComponent />,
      },
      {
        path: "/bill",
        element: <Bill />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forgot",
        element: <Forgot />,
      },
      {
        path: "/forgot/new-password",
        element: <NewPassword />,
      },
      {
        path: "/admin/home",
        element: <AdminMain />,
      },
      {
        path: "/seller/home",
        element: <SellerMain />,
      },
      {
        path: "/seller/create-category",
        element: <CreateItem />,
      },
      {
        path: "/seller/create-product",
        element: <CreateItem />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/my-orders",
        element: <MyOrders />,
      },
      {
        path: "/profile/detail-order",
        element: <DetailOrder />,
      },
    ],
  },
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;

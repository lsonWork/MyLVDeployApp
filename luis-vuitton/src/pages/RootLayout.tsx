import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

export default function RootLayout() {
  const location = useLocation();
  const hideFooter =
    location.pathname.startsWith("/signin") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/detail/") ||
    location.pathname.startsWith("/bill") ||
    location.pathname.startsWith("/forgot") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/cart");
  const hideHeader =
    location.pathname.startsWith("/forgot") ||
    location.pathname.startsWith("/signin") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/signup");
  return (
    <>
      {!hideHeader && <Header />}
      <main>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}

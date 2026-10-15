
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

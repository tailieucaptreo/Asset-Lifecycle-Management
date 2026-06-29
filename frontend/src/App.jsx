import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import AddDevice from "./pages/AddDevice";
import DeviceList from "./pages/DeviceList";
import ExpiredDevices from "./pages/ExpiredDevices";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import WorkOrders from "./pages/WorkOrders";
import Alerts from "./pages/Alerts";
import ImportExcel from "./pages/ImportExcel";
import DeviceDetail from "./pages/DeviceDetail";
import SpareDevices from "./pages/SpareDevices";
import Login from "./pages/Login";
import VaconList from "./pages/VaconList";
import Category from "./pages/Category";
import CategoryDetail from "./pages/CategoryDetail";

function Layout() {

  const location = useLocation();

  const [open, setOpen] = useState(false);

  const isLoginPage =
    location.pathname === "/";

  // LOGIN -> KHÔNG DÙNG LAYOUT
  if (isLoginPage) {
    return (
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
    );
  }

  // CÁC TRANG KHÁC
  return (

    <div
      className="
      flex
      w-screen
      h-screen
      overflow-hidden
      bg-[#eef2f7]
      "
    >
    
      {/* ================= Desktop Sidebar ================= */}
    
      <div className="hidden md:block">
    
        <Sidebar />
    
      </div>
    
      {/* ================= Mobile Drawer ================= */}
    
      {open && (
    
        <>
    
          <div
    
            className="
            fixed
            inset-0
            bg-black/40
            z-40
            "
    
            onClick={() => setOpen(false)}
    
          />
    
          <div
    
            className="
            fixed
            left-0
            top-0
            w-72
            h-full
            z-50
            "
    
          >
    
            <Sidebar
    
              mobile
    
              setOpen={setOpen}
    
            />
    
          </div>
    
        </>
    
      )}
    
      {/* ================= Content ================= */}
    
      <main
    
        className="
        flex-1
        overflow-auto
        bg-gradient-to-br
        from-slate-100
        via-slate-50
        to-blue-50
        "
    
      >
    
        {/* Mobile Header */}
    
        <div
    
          className="
          md:hidden
          sticky
          top-0
          z-30
          bg-white
          shadow
          px-4
          py-3
          flex
          items-center
          justify-between
          "
    
        >
    
          <button
    
            onClick={() => setOpen(true)}
    
          >
    
            <Menu size={28} />
    
          </button>
    
          <h2
    
            className="
            font-bold
            text-lg
            "
    
          >
    
            Asset Manager
    
          </h2>
    
          <div className="w-7"/>
    
        </div>
        <Routes>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/devices"
            element={<DeviceList />}
          />

          <Route
            path="/devices/expired"
            element={<ExpiredDevices />}
          />

          <Route
            path="/add"
            element={<AddDevice />}
          />

          <Route
            path="/maintenance/schedule"
            element={<MaintenanceSchedule />}
          />

          <Route
            path="/maintenance/work"
            element={<WorkOrders />}
          />

          <Route
            path="/maintenance/alerts"
            element={<Alerts />}
          />

          <Route
            path="/import"
            element={<ImportExcel />}
          />

          <Route
            path="/devices/:id"
            element={<DeviceDetail />}
          />

          <Route
            path="/spare-devices"
            element={<SpareDevices />}
          />

          <Route
            path="/vacon"
            element={<VaconList />}
          />

          <Route
            path="/category"
            element={<Category />}
          />

          <Route
            path="/category/:id"
            element={<CategoryDetail />}
          />

        </Routes>

      </main>

    </div>

  );
}

export default function App() {

  return (

    <BrowserRouter>

      <Layout />

    </BrowserRouter>
  );
}

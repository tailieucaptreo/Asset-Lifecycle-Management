import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

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

function Layout() {

  const location = useLocation();

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

      <Sidebar />

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

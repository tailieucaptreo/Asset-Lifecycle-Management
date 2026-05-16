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

  return (

    <div className="flex">

      {!isLoginPage && <Sidebar />}

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* DEVICES */}
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

        {/* MAINTENANCE */}
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

        {/* IMPORT */}
        <Route
          path="/import"
          element={<ImportExcel />}
        />

        {/* DETAIL */}
        <Route
          path="/devices/:id"
          element={<DeviceDetail />}
        />

        {/* SPARE */}
        <Route
          path="/spare-devices"
          element={<SpareDevices />}
        />

      </Routes>

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

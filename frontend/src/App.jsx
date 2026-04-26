import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddDevice from "./pages/AddDevice";
import DeviceList from "./pages/DeviceList";
import ExpiredDevices from "./pages/ExpiredDevices";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import WorkOrders from "./pages/WorkOrders";
import Alerts from "./pages/Alerts";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceList />} />
          <Route path="/devices/expired" element={<ExpiredDevices />} />
          <Route path="/add" element={<AddDevice />} />
          <Route path="/maintenance/schedule" element={<MaintenanceSchedule />} />
          <Route path="/maintenance/work" element={<WorkOrders />} />
          <Route path="/maintenance/alerts" element={<Alerts />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

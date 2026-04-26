import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddDevice from "./pages/AddDevice";
import DeviceList from "./pages/DeviceList";

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
        </Routes>

      </div>
    </BrowserRouter>
  );
}

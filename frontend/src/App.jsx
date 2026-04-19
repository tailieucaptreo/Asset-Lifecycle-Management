import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddDevice from "./pages/AddDevice";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">

        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDevice />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Chart({ data }) {
  // 📊 Bar - theo tuyến
  const lineMap = {};
  data.forEach(d => {
    lineMap[d.line] = (lineMap[d.line] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(lineMap),
    datasets: [
      {
        label: "Thiết bị theo tuyến",
        data: Object.values(lineMap),
      },
    ],
  };

  // 🥧 Pie - trạng thái
  const statusMap = {
    Active: 0,
    Maintenance: 0,
    Inactive: 0,
  };

  data.forEach(d => {
    if (statusMap[d.status] !== undefined) {
      statusMap[d.status]++;
    }
  });

  const pieData = {
    labels: Object.keys(statusMap),
    datasets: [
      {
        data: Object.values(statusMap),
      },
    ],
  };

  // 📈 Line - theo ngày hết hạn
  const dateMap = {};
  data.forEach(d => {
    const date = new Date(d.expiryDate).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + 1;
  });

  const lineData = {
    labels: Object.keys(dateMap),
    datasets: [
      {
        label: "Thiết bị theo ngày",
        data: Object.values(dateMap),
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {/* BAR */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="mb-3 font-bold">Theo tuyến</h3>
        <Bar data={barData} />
      </div>

      {/* PIE */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="mb-3 font-bold">Trạng thái</h3>
        <Pie data={pieData} />
      </div>

      {/* LINE */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="mb-3 font-bold">Xu hướng</h3>
        <Line data={lineData} />
      </div>

    </div>
  );
}
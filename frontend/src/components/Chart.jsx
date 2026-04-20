import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

export default function Chart({ data }) {

  // ======================
  // 🎯 PIE (TRẠNG THÁI)
  // ======================
  const active = data.filter(d => d.status === "Active").length;
  const maintenance = data.filter(d => d.status === "Maintenance").length;
  const inactive = data.filter(d => d.status === "Inactive").length;

  const pieData = [
    { name: "Active", value: active },
    { name: "Maintenance", value: maintenance },
    { name: "Inactive", value: inactive }
  ];

  const COLORS = {
    Active: "#22c55e",
    Maintenance: "#eab308",
    Inactive: "#6b7280"
  };

  // ======================
  // 📊 BAR CHART (THEO TUYẾN)
  // ======================
  const lineMap = {};

  data.forEach(d => {
    const key = d.line || "Không rõ";

    if (!lineMap[key]) {
      lineMap[key] = { line: key, count: 0 };
    }

    lineMap[key].count++;
  });

  const barData = Object.values(lineMap);

  // ======================
  // 📈 LINE CHART (THEO THỜI GIAN)
  // ======================
  const timeMap = {};

  data.forEach(d => {
    if (!d.installDate) return;

    const date = new Date(d.installDate);
    const key = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!timeMap[key]) {
      timeMap[key] = { time: key, count: 0 };
    }

    timeMap[key].count++;
  });

  const lineData = Object.values(timeMap);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* 📊 BAR - THEO TUYẾN */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-2">Theo tuyến</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="line" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🎨 PIE - TRẠNG THÁI */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-2">Trạng thái</h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 LINE - XU HƯỚNG */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-2">Xu hướng</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
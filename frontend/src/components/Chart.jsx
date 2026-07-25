import {
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  LineChart, 
  Line,
} from "recharts";

export default function Chart({ data = [] }) {

  // 🛡️ SAFE DATA
  if (!Array.isArray(data)) {
    return (
      <div className="bg-white p-4 rounded-xl shadow text-gray-400">
        Không có dữ liệu
      </div>
    );
  }

  // ======================
// 🎯 PIE (TRẠNG THÁI)
// ======================

const calcStatus = (d) => {

  if (
    !d?.installDate ||
    !d?.lifespan
  ) {
    return "Active";
  }

  const now =
    new Date();

  const install =
    new Date(
      d.installDate
    );

  const usedYear =

    (
      now - install
    )

    /

    (
      1000 *
      60 *
      60 *
      24 *
      365
    );

  const percent =
    usedYear
    /
    Number(
      d.lifespan
    );

  // quá tuổi thọ
  if (
    percent >= 1
  ) {
    return "Expired";
  }

  // cần bảo trì
  if (
    percent >= 0.7
  ) {
    return "Maintenance";
  }

  return "Active";
};

const active =
  data.filter(
  d =>
  calcStatus(d)
  ===
  "Active"
  ).length;

const maintenance =
  data.filter(
  d =>
  calcStatus(d)
  ===
  "Maintenance"
  ).length;

const expired =
  data.filter(
  d =>
  calcStatus(d)
  ===
  "Expired"
  ).length;

const pieData = [

  {
  name:
  "Hoạt động",
  
  value:
  active
  },
  
  {
  name:
  "Bảo trì",
  
  value:
  maintenance
  },
  
  {
  name:
  "Quá tuổi thọ",
  
  value:
  expired
  }

];

const total = pieData.reduce(
  (sum, item) => sum + item.value,
  0
);

const COLORS = {

  "Hoạt động":
  "#22c55e",
  
  "Bảo trì":
  "#eab308",
  
  "Quá tuổi thọ":
  "#ef4444"

};

  // ======================
  // 📊 BAR (THEO TUYẾN)
  // ======================
  const lineMap = {};

  data.forEach(d => {
    const key = d?.line || "Không rõ";

    if (!lineMap[key]) {
      lineMap[key] = { line: key, count: 0 };
    }

    lineMap[key].count++;
  });

  const barData = Object.values(lineMap);

  // ======================
  // 📈 LINE (THEO THỜI GIAN)
  // ======================
  const timeMap = {};

  data.forEach(d => {
    if (!d?.installDate) return;

    const date = new Date(d.installDate);
    if (isNaN(date)) return; // 🛡️ chống crash

    const key = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!timeMap[key]) {
      timeMap[key] = { time: key, count: 0 };
    }

    timeMap[key].count++;
  });

  const lineData = Object.values(timeMap);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">

      {/* 📊 BAR */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col min-h-[360px]">
        <h2 className="font-bold mb-2">Theo tuyến</h2>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="line" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🎨 PIE */}
      <div className="bg-white rounded-2xl shadow p-5 min-h-[360px]">
      
        <h2 className="font-bold mb-4">
          Trạng thái
        </h2>
      
        <div className="flex items-center h-[280px]">
      
          {/* Donut */}
          <div className="relative w-1/2 h-full">
      
            <ResponsiveContainer width="100%" height="100%">
      
              <PieChart>
      
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={2}
                  label={false}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[entry.name]}
                    />
                  ))}
                </Pie>
      
                <Tooltip />
      
              </PieChart>
      
            </ResponsiveContainer>
      
            {/* Tổng */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      
              <div className="text-4xl font-bold text-slate-800">
                {total}
              </div>
      
              <div className="text-sm text-slate-500">
                Thiết bị
              </div>
      
            </div>
      
          </div>
      
          {/* Legend */}
          <div className="w-1/2 space-y-3">
      
            {pieData.map(item => {
      
              const percent = total
                ? (item.value * 100 / total).toFixed(1)
                : 0;
      
              return (
      
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
      
                  <div className="flex items-center gap-2">
      
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: COLORS[item.name]
                      }}
                    />
      
                    <span>{item.name}</span>
      
                  </div>
      
                  <span className="font-semibold">
      
                    {item.value}
      
                    <span className="text-slate-500 ml-1">
                      ({percent}%)
                    </span>
      
                  </span>
      
                </div>
      
              );
      
            })}
      
          </div>
      
        </div>
      
      </div>

      {/* 📈 LINE */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col min-h-[360px]">
        <h2 className="font-bold mb-2">Xu hướng</h2>

        <ResponsiveContainer width="100%" height="100%">
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

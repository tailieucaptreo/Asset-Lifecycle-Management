import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Chart({ data }) {

  const group = {};

  data.forEach(d => {
    group[d.line] = (group[d.line] || 0) + 1;
  });

  const chartData = Object.keys(group).map(k => ({
    line: k,
    total: group[k]
  }));

  return (
    <BarChart width={500} height={300} data={chartData}>
      <XAxis dataKey="line" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" />
    </BarChart>
  );
}
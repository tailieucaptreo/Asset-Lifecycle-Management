import { useNavigate } from "react-router-dom";

export default function Card({ title, value, color, icon, to }) {

  const nav = useNavigate();

  return (
    <div
      onClick={() => to && nav(to)}
      className={`${color} text-white p-5 rounded-xl shadow cursor-pointer hover:scale-105 transition`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        <div className="text-2xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}

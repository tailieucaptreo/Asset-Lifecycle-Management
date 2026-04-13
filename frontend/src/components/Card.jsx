export default function Card({ title, value, color }) {
  return (
    <div className={`p-5 rounded-xl text-white ${color}`}>
      <p>{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
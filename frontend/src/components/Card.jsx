import { motion } from "framer-motion";

export default function Card({ title, value, color, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-2xl text-white shadow-xl ${color}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm opacity-80">{title}</h3>
        <div className="opacity-80">{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </motion.div>
  );
}
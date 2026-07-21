import {
  CheckCircle,
  Wrench,
  AlertTriangle,
  XCircle,
  Clock
} from "lucide-react";

export default function DeviceStatus({ status }) {

  const config = {

    Active: {

      text: "Đang hoạt động",

      color:
        "bg-green-100 text-green-700 border-green-300 animate-pulse",

      icon:
        <CheckCircle size={16} />

    },

    Maintenance: {

      text: "Bảo trì",

      color:
        "bg-yellow-100 text-yellow-700 border-yellow-300",

      icon:
        <Wrench size={16} />

    },

    Expired: {

      text: "Quá tuổi thọ",

      color:
        "bg-red-100 text-red-700 border-red-300",

      icon:
        <AlertTriangle size={16} />

    },

    Inactive: {

      text: "Cần bảo trì",

      color:
        "bg-gray-100 text-gray-700 border-gray-300",

      icon:
        <XCircle size={16} />

    },

    Repair: {

      text: "Đang sửa chữa",

      color:
        "bg-orange-100 text-orange-700 border-orange-300",

      icon:
        <Clock size={16} />

    }

  };

  const item =
    config[status] ||

    {

      text: status || "Không rõ",

      color:
        "bg-slate-100 text-slate-700 border-slate-300",

      icon:
        <Clock size={16} />

    };

  return (

    <span

      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        border
        text-xs
        font-semibold
        whitespace-nowrap
        ${item.color}
      `}

    >

      {item.icon}

      {item.text}

    </span>

  );

}

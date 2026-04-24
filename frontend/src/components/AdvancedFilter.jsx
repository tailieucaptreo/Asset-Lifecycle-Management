import Select from "react-select";

export default function AdvancedFilter({ devices = [], filter, setFilter }) {

  // 🛡️ SAFE DATA
  const safeDevices = Array.isArray(devices) ? devices : [];

  const toOptions = (arr) =>
    [...new Set(arr.filter(Boolean))].map(v => ({
      label: v,
      value: v
    }));

  const lineOptions = toOptions(safeDevices.map(d => d?.line));
  const stationOptions = toOptions(safeDevices.map(d => d?.station));

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* TUYẾN */}
      <Select
        isMulti
        options={lineOptions}
        placeholder="Chọn tuyến"
        value={lineOptions.filter(o => filter.line?.includes(o.value))}
        onChange={(val) =>
          setFilter({
            ...filter,
            line: val ? val.map(v => v.value) : []
          })
        }
      />

      {/* GA */}
      <Select
        isMulti
        options={stationOptions}
        placeholder="Chọn nhà ga"
        value={stationOptions.filter(o => filter.station?.includes(o.value))}
        onChange={(val) =>
          setFilter({
            ...filter,
            station: val ? val.map(v => v.value) : []
          })
        }
      />

      {/* TRẠNG THÁI */}
      <Select
        options={statusOptions}
        placeholder="Trạng thái"
        value={statusOptions.find(o => o.value === filter.status) || null}
        onChange={(val) =>
          setFilter({
            ...filter,
            status: val?.value || ""
          })
        }
      />

      {/* ID */}
      <input
        placeholder="🔎 Mã ID"
        className="border p-2 rounded"
        value={filter.id || ""}
        onChange={(e) =>
          setFilter({
            ...filter,
            id: e.target.value
          })
        }
      />

      {/* RESET */}
      <button
        onClick={() =>
          setFilter({
            id: "",
            line: [],
            station: [],
            status: ""
          })
        }
        className="bg-gray-300 hover:bg-gray-400 p-2 rounded col-span-1 md:col-span-4"
      >
        Reset Filter
      </button>
    </div>
  );
}

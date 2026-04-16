import Select from "react-select";

export default function AdvancedFilter({ devices, filter, setFilter }) {

  const toOptions = (arr) =>
    [...new Set(arr)].map(v => ({ label: v, value: v }));

  const lineOptions = toOptions(devices.map(d => d.line));
  const stationOptions = toOptions(devices.map(d => d.station));
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Inactive", value: "Inactive" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-4 grid grid-cols-4 gap-4">

      {/* TUYẾN */}
      <Select
        isMulti
        options={lineOptions}
        placeholder="Chọn tuyến"
        onChange={(val) =>
          setFilter({ ...filter, line: val?.map(v => v.value) || [] })
        }
      />

      {/* GA */}
      <Select
        isMulti
        options={stationOptions}
        placeholder="Chọn nhà ga"
        onChange={(val) =>
          setFilter({ ...filter, station: val?.map(v => v.value) || [] })
        }
      />

      {/* TRẠNG THÁI */}
      <Select
        options={statusOptions}
        placeholder="Trạng thái"
        onChange={(val) =>
          setFilter({ ...filter, status: val?.value || "" })
        }
      />

      {/* ID */}
      <input
        placeholder="🔎 Mã ID"
        className="border p-2 rounded"
        onChange={(e) =>
          setFilter({ ...filter, id: e.target.value })
        }
      />

      {/* RESET */}
      <button
        onClick={() =>
          setFilter({ id: "", line: [], station: [], status: "" })
        }
        className="bg-gray-300 p-2 rounded col-span-4"
      >
        Reset Filter
      </button>
    </div>
  );
}
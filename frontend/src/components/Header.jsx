import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

export default function Header({ onSearch, devices = [] }) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const suggestions = devices.filter(d => {
    const keyword = debounced.toLowerCase();
    return (
      (d.name || "").toLowerCase().includes(keyword) ||
      (d.deviceId || "").toString().includes(keyword)
    );
  }).slice(0, 6);

  const highlight = (text) => {
    if (!debounced) return text;

    const parts = text.split(new RegExp(`(${debounced})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === debounced.toLowerCase()
        ? <span key={i} className="bg-yellow-200">{part}</span>
        : part
    );
  };

  const handleKeyDown = (e) => {
    if (!show) return;

    if (e.key === "ArrowDown") {
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    }

    if (e.key === "Enter" && suggestions[activeIndex]) {
      selectItem(suggestions[activeIndex]);
    }
  };

  const selectItem = (item) => {
    setValue(item.name);
    onSearch(item.name);
    setShow(false);
  };

  return (
    <div className="relative w-full">

      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm thiết bị..."
        className="w-full h-11 pl-10 pr-10 border rounded-xl shadow-sm 
                   focus:ring-2 focus:ring-blue-400 outline-none text-sm"
      />

      <Search className="absolute left-3 top-3 text-gray-400" size={18} />

      {value && (
        <X
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          className="absolute right-3 top-3 text-gray-400 cursor-pointer"
          size={18}
        />
      )}

      {/* DROPDOWN */}
      {show && value && (
        <div className="absolute left-0 right-0 mt-2 w-full min-w-[350px]
                        bg-white border rounded-xl shadow-xl z-50
                        max-h-72 overflow-y-auto">

          {suggestions.length === 0 && (
            <div className="p-3 text-gray-500 text-sm">
              Không tìm thấy
            </div>
          )}

          {suggestions.map((d, index) => (
            <div
              key={d.id}
              onClick={() => selectItem(d)}
              className={`p-3 cursor-pointer border-b transition ${
                index === activeIndex
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium truncate">
                {highlight(d.name || "")}
              </div>

              <div className="text-xs text-gray-500 truncate">
                ID: {d.deviceId} | {d.line} - {d.station}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
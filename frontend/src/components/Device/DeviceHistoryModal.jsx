import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../config";

import {
    X,
    Eye,
    Plus,
    Pencil,
    Trash2
} from "lucide-react";

const ACTION_STYLE = {
    CREATE: {
        label: "Thêm",
        className: "bg-green-100 text-green-700",
        icon: Plus
    },
    UPDATE: {
        label: "Cập nhật",
        className: "bg-yellow-100 text-yellow-700",
        icon: Pencil
    },
    DELETE: {
        label: "Xóa",
        className: "bg-red-100 text-red-700",
        icon: Trash2
    }
};

const FIELD_LABEL = {

    name: "Tên thiết bị",

    deviceId: "Mã thiết bị",

    code: "Ký hiệu",

    brand: "Hãng",

    model: "Model",

    line: "Tuyến",

    station: "Nhà ga",

    area: "Khu vực",

    status: "Trạng thái",

    installDate: "Ngày lắp",

    lastMaintenance: "Bảo trì gần nhất",

    expiryDate: "Ngày hết hạn",

    lifespan: "Tuổi thọ",

    note: "Ghi chú"

};

function formatDate(value) {

    if (!value) return "-";

    return new Date(value).toLocaleString("vi-VN");

}

function formatValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {

        return new Date(value)
            .toLocaleDateString("vi-VN");

    }

    return String(value);

}

function formatField(field) {

    return FIELD_LABEL[field] || field;

}

export default function DeviceHistoryModal({

    open,

    onClose

}) {

    const token =
        localStorage.getItem("token");

    const [loading, setLoading] =
        useState(false);

    const [histories, setHistories] =
        useState([]);

    const [selected, setSelected] =
        useState(null);

    const loadHistory = async () => {

        try {

            setLoading(true);

            const res = await axios.get(

                `${API}/api/devices/history`,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }

            );

            setHistories(res.data || []);

        }

        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Không thể tải lịch sử."

            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        if (open) {

            loadHistory();

        }

    }, [open]);
  
    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

            <div className="bg-white w-[1100px] max-w-[95vw] h-[700px] rounded-xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">

                            Lịch sử thiết bị

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Ghi nhận toàn bộ thao tác thêm, cập nhật và xóa thiết bị.

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="p-2 rounded-lg hover:bg-slate-200 transition"

                    >

                        <X size={20} />

                    </button>

                </div>

                {/* Content */}

                <div className="flex-1 overflow-auto">

                    {loading ? (

                        <div className="h-full flex items-center justify-center text-slate-500">

                            Đang tải lịch sử...

                        </div>

                    ) : histories.length === 0 ? (

                        <div className="h-full flex items-center justify-center text-slate-500">

                            Chưa có dữ liệu lịch sử.

                        </div>

                    ) : (

                        <table className="w-full text-sm">

                            <thead className="sticky top-0 bg-slate-100 z-10">

                                <tr className="text-left">

                                    <th className="px-4 py-3 w-44">

                                        Thời gian

                                    </th>

                                    <th className="px-4 py-3 w-36">

                                        Người thao tác

                                    </th>

                                    <th className="px-4 py-3 w-36">

                                        Hành động

                                    </th>

                                    <th className="px-4 py-3">

                                        Thiết bị

                                    </th>

                                    <th className="px-4 py-3 w-40">

                                        Mã thiết bị

                                    </th>

                                    <th className="px-4 py-3 w-28 text-center">

                                        Chi tiết

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                              {histories.map((item) => {
                          
                                  const action =
                                      ACTION_STYLE[item.action] ||
                                      ACTION_STYLE.UPDATE;
                          
                                  const Icon = action.icon;
                          
                                  return (
                          
                                      <tr
                          
                                          key={item.id}
                          
                                          className="border-b hover:bg-slate-50"
                          
                                      >
                          
                                          <td className="px-4 py-3 whitespace-nowrap">
                          
                                              {formatDate(item.createdAt)}
                          
                                          </td>
                          
                                          <td className="px-4 py-3">
                          
                                              {item.user || "-"}
                          
                                          </td>
                          
                                          <td className="px-4 py-3">
                          
                                              <span
                                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${action.className}`}
                                              >
                          
                                                  <Icon size={14} />
                          
                                                  {action.label}
                          
                                              </span>
                          
                                          </td>
                          
                                          <td className="px-4 py-3">
                          
                                              <div className="font-medium">
                          
                                                  {item.name}
                          
                                              </div>
                          
                                          </td>
                          
                                          <td className="px-4 py-3">
                          
                                              {item.code || "-"}
                          
                                          </td>
                          
                                          <td className="px-4 py-3 text-center">
                          
                                              {item.action === "UPDATE" ? (
                          
                                                  <button
                          
                                                      onClick={() =>
                                                          setSelected(item)
                                                      }
                          
                                                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          
                                                  >
                          
                                                      <Eye size={15} />
                          
                                                      Xem
                          
                                                  </button>
                          
                                              ) : (
                          
                                                  <span className="text-slate-400">
                          
                                                      —
                          
                                                  </span>
                          
                                              )}
                          
                                          </td>
                          
                                      </tr>
                          
                                  );
                          
                              })}
                          
                          </tbody>

                        </table>

                    )}

                  {/* =======================================================
                      CHI TIẾT THAY ĐỔI
                  ======================================================= */}
                  
                  {selected && (
                  
                      <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center">
                  
                          <div className="bg-white w-[700px] max-w-[95vw] rounded-xl shadow-2xl overflow-hidden">
                  
                              {/* Header */}
                  
                              <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">
                  
                                  <div>
                  
                                      <h3 className="text-lg font-bold">
                  
                                          Chi tiết thay đổi
                  
                                      </h3>
                  
                                      <p className="text-sm text-slate-500 mt-1">
                  
                                          {selected.name}
                  
                                      </p>
                  
                                  </div>
                  
                                  <button
                  
                                      onClick={() => setSelected(null)}
                  
                                      className="p-2 rounded-lg hover:bg-slate-200"
                  
                                  >
                  
                                      <X size={18} />
                  
                                  </button>
                  
                              </div>
                  
                              {/* Info */}
                  
                              <div className="px-6 py-4 border-b bg-slate-50 text-sm">
                  
                                  <div>
                  
                                      <b>Người thao tác:</b> {selected.user}
                  
                                  </div>
                  
                                  <div>
                  
                                      <b>Thời gian:</b> {formatDate(selected.createdAt)}
                  
                                  </div>
                  
                              </div>
                  
                              {/* Changes */}
                  
                              <div className="max-h-[450px] overflow-auto">
                  
                                  <table className="w-full text-sm">
                  
                                      <thead className="sticky top-0 bg-slate-100">
                  
                                          <tr>
                  
                                              <th className="px-4 py-3 text-left w-56">
                  
                                                  Trường
                  
                                              </th>
                  
                                              <th className="px-4 py-3 text-left">
                  
                                                  Giá trị cũ
                  
                                              </th>
                  
                                              <th className="px-4 py-3 text-left">
                  
                                                  Giá trị mới
                  
                                              </th>
                  
                                          </tr>
                  
                                      </thead>
                  
                                      <tbody>
                  
                                          {selected.changes &&
                  
                                              Object.entries(selected.changes).map(
                  
                                                  ([field, value]) => (
                  
                                                      <tr key={field} className="border-b">

                                                        <td className="px-4 py-3 font-medium">
                                                    
                                                            {formatField(field)}
                                                    
                                                        </td>
                                                    
                                                        <td className="px-4 py-3">
                                                    
                                                            <div className="flex items-center gap-3">
                                                    
                                                                <span className="px-2 py-1 rounded bg-red-50 text-red-600">
                                                    
                                                                    {formatValue(value.old)}
                                                    
                                                                </span>
                                                    
                                                                <span className="text-slate-400">
                                                    
                                                                    →
                                                    
                                                                </span>
                                                    
                                                                <span className="px-2 py-1 rounded bg-green-50 text-green-700">
                                                    
                                                                    {formatValue(value.new)}
                                                    
                                                                </span>
                                                    
                                                            </div>
                                                    
                                                        </td>
                                                    
                                                    </tr>
                  
                                                  )
                  
                                              )}
                  
                                      </tbody>
                  
                                  </table>
                  
                              </div>
                  
                              {/* Footer */}
                  
                              <div className="flex justify-end gap-2 px-6 py-4 border-t bg-slate-50">
                  
                                  <button
                  
                                      onClick={() => setSelected(null)}
                  
                                      className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
                  
                                  >
                  
                                      Đóng
                  
                                  </button>
                  
                              </div>
                  
                          </div>
                  
                      </div>
                  
                  )}

                </div>

            </div>

        </div>

    );

}

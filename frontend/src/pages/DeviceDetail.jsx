import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../config";
import { ArrowLeft, Pencil, Save, X} from "lucide-react";
import DeviceStatus from "../components/Device/DeviceStatus";
import { formatDate } from "../utils/date";


function formatDate(value) {

    if (!value) return "-";

    return new Date(value).toLocaleDateString("vi-VN");
}

export default function DeviceDetail() {

  const { id } = useParams();

  const [device, setDevice] = useState(null);
  const [edit, setEdit] = useState(false);
  const role =
  localStorage.getItem("role");

 useEffect(() => {

  const loadDevice = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(
          `${API}/api/devices/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!res.ok) {
        throw new Error(
          "Không tải được thiết bị"
        );
      }

      const data =
        await res.json();

      setDevice(data);

    } catch (err) {

      console.log(err);

      alert(
        "Không tải được hồ sơ thiết bị"
      );

    }

  };

  loadDevice();

}, [id]);

  const handleChange = (e) => {
    setDevice({
      ...device,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {

    try {

      const res = await fetch(
      `${API}/api/devices/${id}`,
      {
      method:"PUT",
      
      headers:{
      "Content-Type":
      "application/json",
      
      Authorization:
      `Bearer ${
      localStorage.getItem(
      "token"
      )
      }`
      },
      
      body:
      JSON.stringify(device)
      
      }
      );

      const updated = await res.json();

      setDevice(updated);

      setEdit(false);

      alert("✅ Đã lưu");

    } catch (err) {

      console.log(err);

      alert("❌ Lưu lỗi");
    }
  };

  if (!device) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  const install =
    device.installDate
      ? new Date(device.installDate)
      : null;
  
  const now = new Date();
  
  const usedYear =
    install
      ? (
          (now - install) /
          (1000 * 60 * 60 * 24 * 365)
        ).toFixed(1)
      : 0;
  
  const remainYear =
    device.lifespan
      ? Math.max(
          0,
          (
            Number(device.lifespan) -
            Number(usedYear)
          ).toFixed(1)
        )
      : 0;
  
  const percent =
    device.lifespan
      ? Math.min(
          100,
          (
            Number(usedYear) /
            Number(device.lifespan)
          ) * 100
        )
      : 0;
  
  return (

    <div className="p-8 bg-gray-100 min-h-screen w-full">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      
          <div>
      
              <button
                  onClick={() => window.history.back()}
                  className="
                      flex
                      items-center
                      gap-2
                      text-blue-600
                      hover:text-blue-700
                      font-medium
                      mb-3
                  "
              >
      
                  <ArrowLeft size={18}/>
      
                  Quay lại
      
              </button>
      
              <h1 className="text-3xl font-bold">
      
                  Chi tiết thiết bị
      
              </h1>
      
              <p className="text-gray-500 mt-2">
      
                  Hồ sơ quản lý thiết bị
      
              </p>
      
          </div>
        
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  
            {/* IMAGE */}
            <div className="w-full lg:w-56 xl:w-64">
  
                  <div
                      className="
                          h-64
                          rounded-3xl
                          overflow-hidden
                          bg-slate-100
                          border
                          shadow
                      "
                  >
              
                      {device.image ? (
              
                          <img
              
                              src={device.image}
              
                              className="
                                  w-full
                                  h-full
                                  object-cover
                              "
              
                          />
              
                      ) : (
              
                          <div
                              className="
                                  w-full
                                  h-full
                                  flex
                                  items-center
                                  justify-center
                                  text-gray-400
                                  text-7xl
                              "
                          >
              
                              🖼️
              
                          </div>
              
                      )}
              
                  </div>
              
              </div>
  
              {edit && (
                <input
                  type="text"
                  name="image"
                  value={device.image || ""}
                  onChange={handleChange}
                  placeholder="Link hình ảnh"
                  className="mt-4 w-full border p-3 rounded-xl"
                />
              )}
  
            {/* INFO */}
            <div className="lg:col-span-3">
  
              <div className="mb-8">
  
                  <h2 className="text-4xl font-bold">
              
                      {device.name}
              
                  </h2>
              
                  <p className="text-gray-500 mt-2">
              
                      ID: {device.deviceId}
              
                  </p>
              
                  <div className="mt-4">
              
                      <DeviceStatus
                          status={device.status}
                      />
              
                  </div>
              
              </div>
              
            {/* SUMMARY CARD */}
            <div
                className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-4
                    mt-8
                    mb-10
                "
            >
            
                <SummaryCard
            
                    title="Tuổi thọ"
            
                    value={`${device.lifespan || "-"} năm`}
            
                />
            
                <SummaryCard
            
                    title="Đã dùng"
            
                    value={`${usedYear} năm`}
            
                />
            
                <SummaryCard
            
                    title="Còn lại"
            
                    value={`${remainYear} năm`}
            
                />
            
                <SummaryCard
            
                    title="Tuyến"
            
                    value={device.line || "-"}
            
                />
            
            </div>
            
            <Section title="📋 Thông tin chung">
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
                    <Field
                      label="Tên thiết bị"
                      name="name"
                      value={device.name}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Ký hiệu"
                      name="code"
                      value={device.code}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Mã ID"
                      name="deviceId"
                      value={device.deviceId}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Mã vật tư"
                      name="materialCode"
                      value={device.materialCode}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Tuyến"
                      name="line"
                      value={device.line}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Nhà ga"
                      name="station"
                      value={device.station}
                      edit={edit}
                      onChange={handleChange}
                    />
      
                    <Field
                      label="Khu vực"
                      name="area"
                      value={device.area}
                      edit={edit}
                      onChange={handleChange}
                    />
            
                </div>
            
            </Section>

            <Section title="📅 Thông tin lắp đặt">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
                  <Field
                    label="Tuổi thọ"
                    name="lifespan"
                    value={device.lifespan}
                    edit={edit}
                    onChange={handleChange}
                  />

                  <Field

                      label="Ngày lắp lần đầu"
                  
                      name="originalInstallDate"
                  
                      value={formatDate(device.originalInstallDate)}
                  
                      edit={false}
                  
                  />
    
                  <Field
                      label="Ngày lắp đặt"
                      name="installDate"
                      value={device.installDate}
                      edit={edit}
                      type="date"
                      onChange={handleChange}
                  />
    
                  <Field
                      label="Ngày bảo trì"
                      name="lastMaintenance"
                      value={device.lastMaintenance}
                      edit={edit}
                      type="date"
                      onChange={handleChange}
                  />
                  
                  <Field
                      label="Ngày thay thế"
                      name="replacementDate"
                      value={device.replacementDate}
                      edit={edit}
                      type="date"
                      onChange={handleChange}
                  />
            
                </div>
            
            </Section>

            <Section title="📄 Tài liệu thiết bị">

                <div className="space-y-3">
            
                    {device.datasheet ? (
            
                        <a
            
                            href={device.datasheet}
            
                            target="_blank"
            
                            rel="noreferrer"
            
                            className="
                                text-blue-600
                                underline
                            "
            
                        >
            
                            Xem Datasheet
            
                        </a>
            
                    ) : (
            
                        <p className="text-gray-400">
            
                            Chưa có Datasheet
            
                        </p>
            
                    )}
            
                </div>
            
            </Section>

            <Section title="📝 Ghi chú">

                {edit ? (
            
                    <textarea
            
                        rows={5}
            
                        name="note"
            
                        value={device.note || ""}
            
                        onChange={handleChange}
            
                        className="
                            w-full
                            border
                            rounded-xl
                            p-3
                        "
            
                    />
            
                ) : (
            
                    <div
                        className="
                            min-h-[120px]
                            whitespace-pre-wrap
                            text-gray-700
                        "
                    >
            
                        {device.note || "Không có ghi chú"}
            
                    </div>
            
                )}
            
            </Section>

          </div>

        </div>

      </div>

      {/* ACTION */}

      <div className="border-t mt-10 pt-8">
      
          <div className="flex flex-wrap justify-end gap-3">
      
              <button
                  onClick={() => window.history.back()}
                  className="
                      px-5
                      py-3
                      rounded-xl
                      border
                      bg-white
                      hover:bg-gray-100
                      transition
                  "
              >
                  ← Quay lại
              </button>
      
              {role === "admin" && !edit && (
      
                  <button
                      onClick={() => setEdit(true)}
                      className="
                          px-5
                          py-3
                          rounded-xl
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          transition
                      "
                  >
                      ✏ Chỉnh sửa
                  </button>
      
              )}
      
              {role === "admin" && edit && (
      
                  <>
                      <button
                          onClick={() => setEdit(false)}
                          className="
                              px-5
                              py-3
                              rounded-xl
                              bg-gray-300
                              hover:bg-gray-400
                              transition
                          "
                      >
                          Hủy
                      </button>
      
                      <button
                          onClick={handleSave}
                          className="
                              px-5
                              py-3
                              rounded-xl
                              bg-green-600
                              hover:bg-green-700
                              text-white
                              transition
                          "
                      >
                          💾 Lưu
                      </button>
                  </>
      
              )}
      
          </div>
      
      </div>

    </div>
  );
}

function formatDisplayValue(name, value) {

    if (!value) return "-";

    const dateFields = [

        "installDate",

        "lastMaintenance",

        "replacementDate",

        "expiryDate"

    ];

    if (dateFields.includes(name)) {

        return new Date(value)
            .toLocaleDateString("vi-VN");

    }

    return value;

}

// ================= FIELD COMPONENT =================
function Field({
  label,
  name,
  value,
  edit,
  onChange,
  type = "text"
}) {

  return (

    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      {edit ? (

        <input
          type={type}
          name={name}
          value={
              type === "date"
                  ? (value ? String(value).slice(0, 10) : "")
                  : (value || "")
          }
          onChange={onChange}
          className="mt-1 w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      ) : (

        <div className="mt-1 bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 font-medium min-h-[52px] flex items-center">
          {formatDisplayValue(name, value)}
        </div>

      )}

    </div>
  );
}

function SummaryCard({

    title,

    value

}){

    return(

        <div
            className="
                bg-slate-50
                border
                rounded-2xl
                p-5
                text-center
            "
        >

            <p
                className="
                    text-gray-500
                    text-sm
                "
            >

                {title}

            </p>

            <h3
                className="
                    text-2xl
                    font-bold
                    mt-2
                    text-blue-600
                "
            >

                {value}

            </h3>

        </div>

    );

}

function Section({ title, children }) {

    return (

        <div
            className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                p-6
                mt-8
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                    mb-6
                    text-slate-700
                    border-b
                    pb-3
                "
            >

                {title}

            </h2>

            {children}

        </div>

    );

}

export default function SpareDevices() {

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        🔋 Thiết bị dự phòng
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-gray-500">
            Tổng thiết bị
          </p>

          <h2 className="text-3xl font-bold mt-2">
            24
          </h2>
        </div>

        <div className="bg-green-500 text-white rounded-2xl shadow p-5">
          <p>
            Thiết bị mới
          </p>

          <h2 className="text-3xl font-bold mt-2">
            18
          </h2>
        </div>

        <div className="bg-yellow-500 text-white rounded-2xl shadow p-5">
          <p>
            Đã sử dụng
          </p>

          <h2 className="text-3xl font-bold mt-2">
            6
          </h2>
        </div>

        <div className="bg-blue-500 text-white rounded-2xl shadow p-5">
          <p>
            Kho lưu trữ
          </p>

          <h2 className="text-xl font-bold mt-2">
            GA02
          </h2>
        </div>

      </div>

    </div>
  );
}

import axios from "axios";
import API from "../config";

export default function ImportExcel() {

  const handleFile = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${API}/api/devices/import`, formData);

    alert("Upload thành công");
  };

  return (
    <div className="bg-white p-5 rounded shadow mt-6">
      <h3 className="mb-3 font-bold">Import Excel</h3>
      <input type="file" onChange={handleFile} />
    </div>
  );
}
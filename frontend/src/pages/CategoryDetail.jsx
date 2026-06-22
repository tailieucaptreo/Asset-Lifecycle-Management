import { useParams } from "react-router-dom";

export default function CategoryDetail() {

  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        Chi tiết nhóm thiết bị {id}
      </h1>
    </div>
  );
}

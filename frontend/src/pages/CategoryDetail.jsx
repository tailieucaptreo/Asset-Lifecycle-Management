import { useParams } from "react-router-dom";

export default function CategoryDetail() {

  const { id } = useParams();

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold">

        Nhóm thiết bị:
        {" "}
        {decodeURIComponent(id)}

      </h1>

    </div>

  );

}

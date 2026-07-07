import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CategoryDetailHeader({

    category,

    total

}){

    const nav = useNavigate();

    return(

        <div className="flex justify-between items-center mb-6">

            <div>

                <button
                    onClick={()=>nav(-1)}
                    className="
                        flex
                        items-center
                        gap-2
                        text-blue-600
                        mb-3
                    "
                >

                    <ArrowLeft size={18}/>

                    Quay lại

                </button>

                <h1 className="text-3xl font-bold">

                    {category}

                </h1>

                <p className="text-gray-500">

                    {total} thiết bị

                </p>

            </div>

        </div>

    );

}

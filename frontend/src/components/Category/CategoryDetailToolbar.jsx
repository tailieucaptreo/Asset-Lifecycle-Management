import { Search } from "lucide-react";

export default function CategoryDetailToolbar({

    keyword,

    setKeyword

}){

    return(

        <div className="bg-white rounded-2xl shadow p-4 mb-6">

            <div className="relative">

                <Search
                    size={18}
                    className="
                        absolute
                        left-3
                        top-3.5
                        text-gray-400
                    "
                />

                <input

                    value={keyword}

                    onChange={(e)=>setKeyword(e.target.value)}

                    placeholder="Tìm thiết bị..."

                    className="
                        w-full
                        pl-10
                        py-3
                        border
                        rounded-xl
                    "

                />

            </div>

        </div>

    );

}

import { Search } from "lucide-react";

export default function CategoryToolbar({

    keyword,

    setKeyword

}){

    return(

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-4
                mb-6
            "
        >

            <div className="relative">

                <Search
                    size={18}
                    className="
                        absolute
                        left-4
                        top-3.5
                        text-gray-400
                    "
                />

                <input

                    value={keyword}

                    onChange={(e)=>setKeyword(e.target.value)}

                    placeholder="Tìm phân loại..."

                    className="
                        w-full
                        pl-11
                        pr-4
                        py-3
                        rounded-xl
                        border
                    "

                />

            </div>

        </div>

    );

}
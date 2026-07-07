import {

    Search,

    Download,

    Upload,

    Plus

} from "lucide-react";

import SpareFilter from "./SpareFilter";

export default function SpareToolbar({

    role,

    search,

    setSearch,

    filter,

    setFilter,

    onExport,

    onImport,

    onCreate,

    onHistory

}){

    return(

        <div
            className="
                flex
                flex-col
                md:flex-row
                gap-3
            "
        >

            <div className="relative">

                <Search

                    size={18}

                    className="
                        absolute
                        left-3
                        top-3
                        text-gray-400
                    "

                />

                <input

                    value={search}

                    onChange={(e)=>

                        setSearch(

                            e.target.value

                        )

                    }

                    placeholder="Tìm thiết bị..."

                    className="
                        pl-10
                        pr-4
                        py-3
                        rounded-xl
                        border
                        w-[250px]
                        bg-white
                    "

                />

            </div>

            <SpareFilter

                filter={filter}

                setFilter={setFilter}

            />

            {

                role==="admin"

                &&

                <label
                    className="
                        bg-purple-500
                        hover:bg-purple-600
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        flex
                        items-center
                        gap-2
                        cursor-pointer
                    "
                >

                    <Upload size={18}/>

                    Import

                    <input

                        hidden

                        type="file"

                        accept=".xlsx,.xls"

                        onChange={(e)=>{

                            const file=

                                e.target.files[0];

                            if(file){

                                onImport(file);

                            }

                        }}

                    />

                </label>

            }

            {

                role==="admin"

                &&

                <button

                    onClick={onExport}

                    className="
                        bg-green-500
                        text-white
                        px-5
                        py-3
                        rounded-xl
                    "

                >

                    <Download size={18}/>

                </button>

            }

            {

                role==="admin"

                &&

                <button

                    onClick={onCreate}

                    className="
                        bg-blue-500
                        text-white
                        px-5
                        py-3
                        rounded-xl
                    "

                >

                    <Plus size={18}/>

                </button>

            }

            <button

                onClick={onHistory}

                className="
                    bg-gray-800
                    text-white
                    px-5
                    py-3
                    rounded-xl
                "

            >

                🕘 Lịch sử

            </button>

        </div>

    );

}

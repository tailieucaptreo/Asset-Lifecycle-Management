import { Search, RotateCcw } from "lucide-react";

export default function DeviceFilter({

    filters,

    setFilters,

    data = []

}) {

    const stations = [
        ...new Set(
            data
                .map(d => d.station)
                .filter(Boolean)
        )
    ];

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-4
                mb-5
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-4
                    gap-4
                "
            >

                {/* SEARCH */}

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

                        type="text"

                        placeholder="Tên thiết bị..."

                        value={filters.name || ""}

                        onChange={(e)=>

                            setFilters({

                                ...filters,

                                name:e.target.value

                            })

                        }

                        className="
                            w-full
                            border
                            rounded-lg
                            pl-10
                            pr-3
                            py-2
                            focus:ring-2
                            focus:ring-blue-500
                        "

                    />

                </div>

                {/* STATION */}

                <select

                    value={filters.station || ""}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            station:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-lg
                        px-3
                        py-2
                    "

                >

                    <option value="">
                        Tất cả nhà ga
                    </option>

                    {stations.map(station=>(

                        <option
                            key={station}
                            value={station}
                        >
                            {station}
                        </option>

                    ))}

                </select>

                {/* STATUS */}

                <select

                    value={filters.status || ""}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            status:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-lg
                        px-3
                        py-2
                    "

                >

                    <option value="">
                        Tất cả trạng thái
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Maintenance">
                        Maintenance
                    </option>

                    <option value="Expired">
                        Expired
                    </option>

                </select>

                {/* RESET */}

                <button

                    onClick={()=>{

                        setFilters({

                            name:"",

                            station:"",

                            status:""

                        });

                    }}

                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-gray-200
                        hover:bg-gray-300
                        transition
                    "

                >

                    <RotateCcw size={18}/>

                    Reset

                </button>

            </div>

        </div>

    );

}

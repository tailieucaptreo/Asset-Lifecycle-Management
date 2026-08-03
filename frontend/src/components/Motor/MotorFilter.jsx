import {
    RotateCcw
} from "lucide-react";

export default function MotorFilter({

    filters,

    setFilters,

    data = []

}) {

    const lines = [
        ...new Set(
            data
                .map(item => item.line)
                .filter(Boolean)
        )
    ].sort();

    const stations = [
        ...new Set(
            data
                .map(item => item.station)
                .filter(Boolean)
        )
    ].sort();

    const brands = [
        ...new Set(
            data
                .map(item => item.brand)
                .filter(Boolean)
        )
    ].sort();

    const motorTypes = [
        "Động cơ chính",
        "Động cơ bơm dầu",
        "Động cơ làm mát",
        "Động cơ phanh",
        "Động cơ nâng hạ",
        "Động cơ khác"
    ];

    const statuses = [
        "Đang hoạt động",
        "Bảo trì",
        "Đã thay",
        "Chưa thay"
    ];

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                border-slate-200
                p-5
                mb-5
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-5
                    gap-4
                "
            >
                {/* LINE */}

                <select

                    value={filters.line || ""}

                    onChange={(e) =>

                        setFilters({

                            ...filters,

                            line: e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="">
                        Tất cả tuyến
                    </option>

                    {lines.map(line => (

                        <option

                            key={line}

                            value={line}

                        >

                            {line}

                        </option>

                    ))}

                </select>

                {/* STATION */}

                <select

                    value={filters.station || ""}

                    onChange={(e) =>

                        setFilters({

                            ...filters,

                            station: e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="">
                        Tất cả nhà ga
                    </option>

                    {stations.map(station => (

                        <option

                            key={station}

                            value={station}

                        >

                            {station}

                        </option>

                    ))}

                </select>

                {/* BRAND */}

                <select

                    value={filters.brand || ""}

                    onChange={(e) =>

                        setFilters({

                            ...filters,

                            brand: e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="">
                        Tất cả hãng
                    </option>

                    {brands.map(brand => (

                        <option

                            key={brand}

                            value={brand}

                        >

                            {brand}

                        </option>

                    ))}

                </select>

                {/* MOTOR TYPE */}

                <select

                    value={filters.type || ""}

                    onChange={(e) =>

                        setFilters({

                            ...filters,

                            type: e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="">
                        Loại động cơ
                    </option>

                    {motorTypes.map(type => (

                        <option

                            key={type}

                            value={type}

                        >

                            {type}

                        </option>

                    ))}

                </select>

            </div>

            {/* ROW 2 */}

            <div
                className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-3
                "
            >

                {/* STATUS */}

                <select

                    value={filters.status || ""}

                    onChange={(e) =>

                        setFilters({

                            ...filters,

                            status: e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                        min-w-[220px]
                    "

                >

                    <option value="">
                        Tất cả trạng thái
                    </option>

                    {statuses.map(status => (

                        <option

                            key={status}

                            value={status}

                        >

                            {status}

                        </option>

                    ))}

                </select>

                {/* RESET */}

                <button

                    onClick={() =>

                        setFilters({

                            line: "",

                            station: "",

                            brand: "",

                            type: "",

                            status: ""

                        })

                    }

                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-slate-200
                        hover:bg-slate-300
                        px-4
                        py-2.5
                        transition
                    "

                >

                    <RotateCcw size={18} />

                    Đặt lại

                </button>

            </div>

        </div>

    );

}

export default function SpareFilter({

    filters,

    setFilters,

    data = []

}) {

    const warehouses = [
        ...new Set(
            data
                .map(d => d.warehouse)
                .filter(Boolean)
        )
    ];

    const cabinets = [
        ...new Set(
            data
                .map(d => d.cabinet)
                .filter(Boolean)
        )
    ];

    const shelves = [
        ...new Set(
            data
                .map(d => d.shelf)
                .filter(Boolean)
        )
    ];

    const conditions = [
        ...new Set(
            data
                .map(d => d.condition)
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
                mb-6
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                "
            >

                {/* Kho */}

                <select

                    value={filters.warehouse}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            warehouse:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                >

                    <option value="">
                        Tất cả kho
                    </option>

                    {warehouses.map(item=>(

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Tủ */}

                <select

                    value={filters.cabinet}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            cabinet:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                >

                    <option value="">
                        Tất cả tủ
                    </option>

                    {cabinets.map(item=>(

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Kệ */}

                <select

                    value={filters.shelf}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            shelf:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                >

                    <option value="">
                        Tất cả kệ
                    </option>

                    {shelves.map(item=>(

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Tình trạng */}

                <select

                    value={filters.condition}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            condition:e.target.value

                        })

                    }

                    className="
                        border
                        rounded-xl
                        px-4
                        py-3
                    "

                >

                    <option value="">
                        Tất cả tình trạng
                    </option>

                    {conditions.map(item=>(

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

            </div>

        </div>

    );

}
